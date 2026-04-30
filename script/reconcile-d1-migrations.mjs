#!/usr/bin/env node
/**
 * Pre-deploy reconciler for the Cloudflare D1 `d1_migrations` ledger.
 *
 * Why this exists
 * ---------------
 * D1 / SQLite does NOT support `ALTER TABLE … ADD COLUMN IF NOT EXISTS`, so
 * once an ALTER-TABLE migration has been applied to the schema it can never
 * be safely re-run. If the `d1_migrations` ledger drifts (e.g. a row goes
 * missing, or a migration is applied via `wrangler d1 execute` instead of
 * `wrangler d1 migrations apply`), the next deploy will try to re-apply
 * those migrations and fail with `duplicate column name: …` or
 * `table … already exists`, breaking CI.
 *
 * What this script does
 * ---------------------
 * 1. Lists every `migrations/*.sql` file.
 * 2. Lists rows already in the remote `d1_migrations` ledger.
 * 3. For each pending migration, parses its SQL and checks the live schema
 *    via `PRAGMA table_info` / `sqlite_master`. If every CREATE TABLE,
 *    ADD COLUMN, and CREATE INDEX statement in the file is already
 *    represented in the live database, the migration's work is done — we
 *    INSERT a row into `d1_migrations` so wrangler skips it.
 * 4. Migrations that contain DML (INSERT/UPDATE/DELETE) are only stamped
 *    when every DML statement is unambiguously safe to skip
 *    (`INSERT OR IGNORE`, `INSERT … ON CONFLICT … DO NOTHING`, `UPDATE`,
 *    `DELETE`). Anything else is left alone for wrangler to handle.
 * 5. Migrations whose schema work isn't fully present are also left alone —
 *    wrangler will run them normally.
 *
 * The script is a strict no-op when the ledger and schema already agree:
 * "0 migrations needed reconciliation" is the healthy steady state.
 *
 * Usage
 * -----
 *   node script/reconcile-d1-migrations.mjs \
 *     --database savvy-admin \
 *     --config wrangler-workers.toml \
 *     [--dry-run]
 *
 * Requires: `wrangler` available on PATH (CI uses cloudflare/wrangler-action;
 * locally use `npx wrangler …`), plus `CLOUDFLARE_API_TOKEN` and
 * `CLOUDFLARE_ACCOUNT_ID` in the environment for `--remote` operations.
 */

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = parseArgs(process.argv.slice(2));
const DATABASE = args.database ?? "savvy-admin";
const CONFIG = args.config ?? "wrangler-workers.toml";
const DRY_RUN = args["dry-run"] === true;
const REQUIRE_IN_SYNC = args["require-in-sync"] === true;
const MIGRATIONS_DIR = args["migrations-dir"] ?? "migrations";
const WRANGLER = process.env.WRANGLER_BIN || "npx";
const WRANGLER_ARGS_PREFIX = process.env.WRANGLER_BIN ? [] : ["wrangler"];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function runWrangler(extraArgs) {
  const cmdArgs = [...WRANGLER_ARGS_PREFIX, ...extraArgs];
  const res = spawnSync(WRANGLER, cmdArgs, { encoding: "utf8" });
  if (res.status !== 0) {
    const stderr = res.stderr ?? "";
    const stdout = res.stdout ?? "";
    throw new Error(
      `wrangler ${extraArgs.join(" ")} failed (exit ${res.status}):\n${stderr || stdout}`,
    );
  }
  return res.stdout ?? "";
}

function execSql(sql) {
  const out = runWrangler([
    "d1",
    "execute",
    DATABASE,
    "--remote",
    "--config",
    CONFIG,
    "--json",
    "--command",
    sql,
  ]);
  return parseWranglerJson(out);
}

function parseWranglerJson(out) {
  const trimmed = out.trim();
  if (!trimmed) return [];
  // wrangler prints some banner lines before the JSON in some versions; find
  // the first "[" or "{" and parse from there.
  const start = trimmed.search(/[\[{]/);
  if (start === -1) return [];
  try {
    const parsed = JSON.parse(trimmed.slice(start));
    // Newer wrangler returns [{ results: [...] }]; older returns { results: [...] }.
    if (Array.isArray(parsed)) {
      return parsed.flatMap((p) => p.results ?? []);
    }
    return parsed.results ?? [];
  } catch (e) {
    throw new Error(`Failed to parse wrangler JSON output: ${e.message}\nRaw:\n${out}`);
  }
}

function listMigrationFiles() {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

function loadAppliedLedger() {
  // d1_migrations is auto-created by wrangler; if the table doesn't exist
  // yet (very first deploy) treat the ledger as empty.
  try {
    const rows = execSql(
      "SELECT name FROM d1_migrations ORDER BY id;",
    );
    return new Set(rows.map((r) => r.name));
  } catch (e) {
    if (/no such table/i.test(e.message)) return new Set();
    throw e;
  }
}

/**
 * Strip SQL comments and split a file into individual statements.
 */
function splitStatements(sql) {
  // Remove -- line comments and /* ... */ block comments. We deliberately do
  // NOT touch strings — none of our migration statements have semicolons
  // inside string literals that would matter for splitting at the top level.
  const noLineComments = sql.replace(/--[^\n]*/g, "");
  const noBlockComments = noLineComments.replace(/\/\*[\s\S]*?\*\//g, "");
  return noBlockComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Classify a single SQL statement and pull out the bits we need to verify
 * against the live schema. Anything we don't recognise is marked unknown
 * so we err on the side of NOT auto-stamping.
 */
function classifyStatement(stmt) {
  const s = stmt.replace(/\s+/g, " ").trim();
  const head = s.toUpperCase();

  let m;
  if ((m = /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?/i.exec(s))) {
    return { kind: "create_table", table: m[1] };
  }
  if (
    (m = /^CREATE\s+(UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?/i.exec(s))
  ) {
    return { kind: "create_index", index: m[2] };
  }
  if (
    (m = /^ALTER\s+TABLE\s+["`]?(\w+)["`]?\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?(\w+)["`]?/i.exec(s))
  ) {
    return { kind: "add_column", table: m[1], column: m[2] };
  }
  if (head.startsWith("UPDATE ")) {
    // UPDATE … is naturally idempotent for our purposes — we only need to
    // know it doesn't *block* stamping the ledger.
    return { kind: "idempotent_dml" };
  }
  if (head.startsWith("DELETE ")) {
    return { kind: "idempotent_dml" };
  }
  if (/^DROP\s+TABLE\s+IF\s+EXISTS\b/i.test(s)) {
    return { kind: "idempotent_dml" };
  }
  if (/^DROP\s+INDEX\s+IF\s+EXISTS\b/i.test(s)) {
    return { kind: "idempotent_dml" };
  }
  if (/^INSERT\s+OR\s+IGNORE\b/i.test(s)) {
    return { kind: "idempotent_dml" };
  }
  if (/^INSERT\b[\s\S]*\bON\s+CONFLICT\b[\s\S]*\bDO\s+NOTHING\b/i.test(s)) {
    return { kind: "idempotent_dml" };
  }
  if (head.startsWith("INSERT ")) {
    // Plain INSERT is NOT idempotent — we can't safely auto-stamp.
    return { kind: "unsafe_dml" };
  }
  return { kind: "unknown", preview: s.slice(0, 80) };
}

function tableExists(name) {
  const rows = execSql(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${name.replace(/'/g, "''")}';`,
  );
  return rows.length > 0;
}

function indexExists(name) {
  const rows = execSql(
    `SELECT name FROM sqlite_master WHERE type='index' AND name='${name.replace(/'/g, "''")}';`,
  );
  return rows.length > 0;
}

function columnExists(table, column) {
  if (!tableExists(table)) return false;
  // PRAGMA table_info is parameter-less so we need string interpolation;
  // table names in this repo are static identifiers so this is safe.
  const rows = execSql(`PRAGMA table_info(${table});`);
  return rows.some((r) => r.name === column);
}

function migrationFullyApplied(file) {
  const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
  const stmts = splitStatements(sql);
  if (stmts.length === 0) return { applied: true, reason: "empty file" };

  const reasons = [];
  let sawSchemaWork = false;

  for (const stmt of stmts) {
    const c = classifyStatement(stmt);
    switch (c.kind) {
      case "create_table":
        sawSchemaWork = true;
        if (!tableExists(c.table)) {
          return { applied: false, reason: `table ${c.table} missing` };
        }
        break;
      case "create_index":
        sawSchemaWork = true;
        if (!indexExists(c.index)) {
          return { applied: false, reason: `index ${c.index} missing` };
        }
        break;
      case "add_column":
        sawSchemaWork = true;
        if (!columnExists(c.table, c.column)) {
          return {
            applied: false,
            reason: `column ${c.table}.${c.column} missing`,
          };
        }
        break;
      case "idempotent_dml":
        // Safe to skip even if it hasn't been "applied" — re-running it
        // produces the same end state. No verification needed.
        break;
      case "unsafe_dml":
        return {
          applied: false,
          reason: "contains a non-idempotent INSERT — refusing to auto-stamp",
        };
      case "unknown":
        return {
          applied: false,
          reason: `unrecognized statement: ${c.preview}…`,
        };
    }
  }

  if (!sawSchemaWork) {
    // Pure DML migration with only idempotent statements — let wrangler
    // re-apply it instead of stamping. That's the simpler / safer choice.
    return {
      applied: false,
      reason: "pure idempotent DML — let wrangler re-apply",
    };
  }
  return { applied: true, reason: "all schema changes already present" };
}

function stampLedger(file) {
  const safe = file.replace(/'/g, "''");
  execSql(
    `INSERT INTO d1_migrations (name, applied_at) VALUES ('${safe}', datetime('now'));`,
  );
}

function main() {
  console.log(
    `[reconcile-d1] database=${DATABASE} config=${CONFIG} dry-run=${DRY_RUN} require-in-sync=${REQUIRE_IN_SYNC}`,
  );

  const files = listMigrationFiles();
  const applied = loadAppliedLedger();

  // Detect "ledger-ahead" drift: rows in d1_migrations that no longer have
  // a matching .sql file. This is a separate failure mode from the
  // "schema-ahead" drift this script reconciles, but worth surfacing in
  // the same place so it doesn't silently rot.
  const fileSet = new Set(files);
  const orphanLedgerRows = [...applied].filter((name) => !fileSet.has(name));
  if (orphanLedgerRows.length > 0) {
    console.warn(
      `[reconcile-d1] WARNING: ${orphanLedgerRows.length} ledger row(s) reference migration files that no longer exist: ${orphanLedgerRows.join(", ")}. The reconciler does NOT attempt to repair this; review by hand.`,
    );
  }

  const pending = files.filter((f) => !applied.has(f));
  console.log(
    `[reconcile-d1] ${files.length} migration files, ${applied.size} already in ledger, ${pending.length} pending`,
  );

  if (pending.length === 0) {
    console.log("[reconcile-d1] ledger is in sync — nothing to do");
    return;
  }

  let stamped = 0;
  let leftAlone = 0;
  for (const file of pending) {
    const result = migrationFullyApplied(file);
    if (result.applied) {
      if (DRY_RUN) {
        console.log(`[reconcile-d1] WOULD STAMP ${file} (${result.reason})`);
      } else {
        stampLedger(file);
        console.log(`[reconcile-d1] STAMPED ${file} (${result.reason})`);
      }
      stamped++;
    } else {
      console.log(`[reconcile-d1] LEAVE   ${file} (${result.reason})`);
      leftAlone++;
    }
  }

  console.log(
    `[reconcile-d1] done: ${stamped} stamped, ${leftAlone} left for wrangler to apply`,
  );

  // In strict mode (intended for the post-apply CI verification step), the
  // ledger and schema MUST agree. If anything is still pending — either a
  // file we'd stamp or a file we're punting to wrangler — that's a bug.
  if (REQUIRE_IN_SYNC && pending.length > 0) {
    console.error(
      `[reconcile-d1] FAIL: --require-in-sync was set but ${pending.length} migration(s) are still pending after apply. Ledger and schema are not in sync.`,
    );
    process.exit(2);
  }
}

// Only run when invoked directly (not when imported for testing).
const argvPath = process.argv[1] ?? "";
const invokedDirectly =
  argvPath.length > 0 && import.meta.url === `file://${argvPath}`;
if (invokedDirectly) {
  try {
    main();
  } catch (e) {
    console.error(`[reconcile-d1] FATAL: ${e.message}`);
    process.exit(1);
  }
}

// Exported for unit testing.
export { classifyStatement, splitStatements, migrationFullyApplied };
