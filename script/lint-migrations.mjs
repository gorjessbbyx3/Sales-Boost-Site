#!/usr/bin/env node
/**
 * CI lint check for D1 migration SQL files.
 *
 * Why this exists
 * ---------------
 * `migrations/README.md` documents a small set of authoring rules that keep
 * our D1 migrations safe to re-apply ("use `CREATE TABLE IF NOT EXISTS`,
 * `INSERT OR IGNORE`, etc."). Until now those rules were enforced socially.
 * The pre-deploy reconciler (`script/reconcile-d1-migrations.mjs`) exists as
 * a safety net for `ALTER TABLE … ADD COLUMN`, the one statement D1/SQLite
 * can NOT guard with `IF NOT EXISTS`, but it is not a substitute for writing
 * idempotent SQL in the first place.
 *
 * What this script enforces
 * -------------------------
 * For every `migrations/*.sql` file:
 *
 *   1. `CREATE TABLE …`              must include `IF NOT EXISTS`.
 *   2. `CREATE [UNIQUE] INDEX …`     must include `IF NOT EXISTS`.
 *   3. `INSERT INTO …`               must be `INSERT OR IGNORE` *or* include
 *                                    `ON CONFLICT … DO NOTHING`.
 *   4. `ALTER TABLE … ADD COLUMN`    must NOT include `IF NOT EXISTS`
 *                                    (D1/SQLite does not support that
 *                                    syntax — the reconciler stamps the
 *                                    ledger when the column already exists).
 *
 * Plain `ALTER TABLE … ADD COLUMN` (without `IF NOT EXISTS`) is tolerated:
 * D1 cannot guard it, the reconciler is what makes it safe to re-apply.
 *
 * Exit codes
 * ----------
 *   0 — no violations
 *   1 — one or more violations found
 *   2 — internal error (e.g. could not read the migrations directory)
 *
 * Usage
 * -----
 *   node script/lint-migrations.mjs
 *   node script/lint-migrations.mjs --migrations-dir some/other/dir
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { splitStatements } from "./reconcile-d1-migrations.mjs";

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

const RULES = {
  CREATE_TABLE_IF_NOT_EXISTS: "create-table-if-not-exists",
  CREATE_INDEX_IF_NOT_EXISTS: "create-index-if-not-exists",
  INSERT_MUST_BE_IDEMPOTENT: "insert-must-be-idempotent",
  NO_ADD_COLUMN_IF_NOT_EXISTS: "no-add-column-if-not-exists",
};

// Severities: "error" fails the build, "warning" is reported but does not
// change the exit code. `ADD COLUMN IF NOT EXISTS` is a warning per the
// task spec — D1/SQLite would reject the SQL at apply time anyway, so this
// is a heads-up to the author rather than a separate gate.
const SEVERITY = {
  [RULES.CREATE_TABLE_IF_NOT_EXISTS]: "error",
  [RULES.CREATE_INDEX_IF_NOT_EXISTS]: "error",
  [RULES.INSERT_MUST_BE_IDEMPOTENT]: "error",
  [RULES.NO_ADD_COLUMN_IF_NOT_EXISTS]: "warning",
};

/**
 * Run every rule against a single statement and return the list of
 * findings (empty when the statement is clean). Each finding has a
 * `severity` of "error" (fails the build) or "warning" (informational).
 */
function lintStatement(stmt) {
  const s = stmt.replace(/\s+/g, " ").trim();
  if (!s) return [];
  const findings = [];

  function record(rule, message) {
    findings.push({ rule, severity: SEVERITY[rule], message });
  }

  // 1. CREATE TABLE without IF NOT EXISTS
  if (
    /^CREATE\s+TABLE\b/i.test(s) &&
    !/^CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\b/i.test(s)
  ) {
    record(
      RULES.CREATE_TABLE_IF_NOT_EXISTS,
      "CREATE TABLE must include 'IF NOT EXISTS' so the migration is safe to re-apply against a database where the table already exists.",
    );
  }

  // 2. CREATE [UNIQUE] INDEX without IF NOT EXISTS
  if (
    /^CREATE\s+(?:UNIQUE\s+)?INDEX\b/i.test(s) &&
    !/^CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\b/i.test(s)
  ) {
    record(
      RULES.CREATE_INDEX_IF_NOT_EXISTS,
      "CREATE INDEX must include 'IF NOT EXISTS' so the migration is safe to re-apply against a database where the index already exists.",
    );
  }

  // 3. ALTER TABLE … ADD COLUMN IF NOT EXISTS — invalid D1/SQLite syntax.
  //    Reported as a WARNING (not an error) per the task spec: D1 will
  //    reject the SQL at apply time anyway, and we don't want this rule
  //    to mask the underlying problem (a bare ADD COLUMN is the right
  //    pattern; the reconciler handles re-apply safety).
  if (
    /^ALTER\s+TABLE\b[\s\S]*\bADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\b/i.test(s)
  ) {
    record(
      RULES.NO_ADD_COLUMN_IF_NOT_EXISTS,
      "ALTER TABLE … ADD COLUMN IF NOT EXISTS is NOT supported by D1/SQLite and will fail at apply time. Drop the 'IF NOT EXISTS' clause; the pre-deploy reconciler stamps the ledger when the column already exists.",
    );
  }

  // 4. INSERT without OR IGNORE / ON CONFLICT … DO NOTHING.
  //    `INSERT OR IGNORE` and `INSERT … ON CONFLICT … DO NOTHING` are both
  //    accepted; everything else is rejected because re-applying it would
  //    duplicate the seed row.
  if (/^INSERT\b/i.test(s)) {
    const hasOrIgnore = /^INSERT\s+OR\s+IGNORE\b/i.test(s);
    const hasOnConflictDoNothing =
      /\bON\s+CONFLICT\b[\s\S]*\bDO\s+NOTHING\b/i.test(s);
    if (!hasOrIgnore && !hasOnConflictDoNothing) {
      record(
        RULES.INSERT_MUST_BE_IDEMPOTENT,
        "INSERT must be 'INSERT OR IGNORE …' or include 'ON CONFLICT (…) DO NOTHING' so re-applying the migration does not duplicate seed rows.",
      );
    }
  }

  return findings;
}

/**
 * Lint a single .sql file and return all findings in it. Each finding
 * carries a `severity` ("error" or "warning").
 */
function lintFile(filePath) {
  const sql = readFileSync(filePath, "utf8");
  const stmts = splitStatements(sql);
  const findings = [];
  for (const stmt of stmts) {
    for (const v of lintStatement(stmt)) {
      const preview = stmt.replace(/\s+/g, " ").trim().slice(0, 120);
      findings.push({ ...v, statement: preview });
    }
  }
  return findings;
}

function listSqlFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .filter((f) => {
      try {
        return statSync(join(dir, f)).isFile();
      } catch {
        return false;
      }
    })
    .sort();
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const migrationsDir = args["migrations-dir"] ?? "migrations";

  let files;
  try {
    files = listSqlFiles(migrationsDir);
  } catch (e) {
    console.error(
      `[lint-migrations] FATAL: could not read ${migrationsDir}/: ${e.message}`,
    );
    process.exit(2);
  }

  console.log(
    `[lint-migrations] checking ${files.length} migration file(s) in ${migrationsDir}/`,
  );

  let errorCount = 0;
  let warningCount = 0;
  let dirtyFiles = 0;
  for (const file of files) {
    const findings = lintFile(join(migrationsDir, file));
    if (findings.length === 0) continue;
    dirtyFiles++;
    for (const v of findings) {
      const log = v.severity === "error" ? console.error : console.warn;
      const tag = v.severity === "error" ? "ERROR" : "WARN";
      log(
        `[lint-migrations] ${tag} ${file}: [${v.rule}] ${v.message}`,
      );
      log(`  > ${v.statement}${v.statement.length >= 120 ? "…" : ""}`);
      if (v.severity === "error") errorCount++;
      else warningCount++;
    }
  }

  if (errorCount > 0) {
    console.error(
      `\n[lint-migrations] FAIL: ${errorCount} error(s) and ${warningCount} warning(s) across ${dirtyFiles} file(s). See migrations/README.md for the authoring rules.`,
    );
    process.exit(1);
  }

  if (warningCount > 0) {
    console.warn(
      `\n[lint-migrations] OK with ${warningCount} warning(s) across ${dirtyFiles} file(s) — no build-failing violations.`,
    );
    return;
  }

  console.log(
    `[lint-migrations] OK: ${files.length} file(s) clean — no risky migration patterns found.`,
  );
}

const argvPath = process.argv[1] ?? "";
const invokedDirectly =
  argvPath.length > 0 && import.meta.url === `file://${argvPath}`;
if (invokedDirectly) {
  try {
    main();
  } catch (e) {
    console.error(`[lint-migrations] FATAL: ${e.message}`);
    process.exit(2);
  }
}

// Exported for unit testing.
export { lintStatement, lintFile, RULES };
