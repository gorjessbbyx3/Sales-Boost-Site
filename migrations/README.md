# D1 Migrations Runbook

This folder holds the SQL migrations that Cloudflare D1 runs against the
`savvy-admin` database (id: `1bbb0cdc-f9c3-4043-baad-48f9a7caa16e`).

Migrations are applied automatically by `.github/workflows/deploy.yml` on every
push to `main`. The pipeline does two things in order:

1. **Reconcile** the ledger via `script/reconcile-d1-migrations.mjs` — auto
   stamps `d1_migrations` rows for any pending migration whose schema work is
   already present in the live database.
2. **Apply** any genuinely-pending migrations via:
   ```
   wrangler d1 migrations apply savvy-admin --remote --config wrangler-workers.toml
   ```

Wrangler tracks which files have been applied in a system table called
`d1_migrations` inside the database itself.

## Authoring rules — make new migrations as idempotent as D1 allows

Cloudflare D1 is built on SQLite, and SQLite has a few hard limits we have to
plan around. The cheat sheet:

| Statement                                          | D1 supports `IF NOT EXISTS`? | Idempotent on re-apply? |
| -------------------------------------------------- | ---------------------------- | ----------------------- |
| `CREATE TABLE IF NOT EXISTS …`                     | ✅                            | ✅                       |
| `CREATE INDEX IF NOT EXISTS …`                     | ✅                            | ✅                       |
| `CREATE UNIQUE INDEX IF NOT EXISTS …`              | ✅                            | ✅                       |
| `ALTER TABLE … ADD COLUMN …`                       | ❌ no `IF NOT EXISTS`         | ❌ fails on re-apply     |
| `ALTER TABLE … RENAME COLUMN …`                    | ❌ no `IF NOT EXISTS`         | ❌ fails on re-apply     |
| `INSERT OR IGNORE INTO …`                          | ✅                            | ✅                       |
| `INSERT … ON CONFLICT(...) DO NOTHING`             | ✅                            | ✅                       |
| `UPDATE …` / `DELETE …`                            | n/a                          | ✅ (effect is the same)  |

**Use the IF-NOT-EXISTS / OR IGNORE / ON CONFLICT forms wherever D1 supports
them.** That covers everything in a typical migration *except* `ALTER TABLE …
ADD COLUMN`, which D1 cannot guard against duplicates at the SQL level.

For `ADD COLUMN`, the safety net is the **pre-deploy reconciler**
(`script/reconcile-d1-migrations.mjs`). It parses each pending migration,
checks the live schema with `PRAGMA table_info` / `sqlite_master`, and if all
the schema work is already done it inserts the ledger row so wrangler skips
the file. This is what protects us from the "ledger drifted from schema"
deploy failure.

So: write your `ADD COLUMN` statements normally and let the reconciler handle
the case where someone has already applied the column out-of-band.

If you genuinely need a non-idempotent operation (e.g. a one-shot data
backfill), keep it in its own migration so the reconciler only has to reason
about that specific step.

## Why this matters

The `d1_migrations` ledger and the live schema can drift apart. We have seen
this happen in production:

- Some 0011–0022 migrations were applied to the schema (columns/tables exist),
  but the corresponding rows were missing from `d1_migrations`.
- The next deploy tried to re-apply 0011 (`ALTER TABLE admin_files ADD COLUMN
  folder …`) and failed with "duplicate column name: folder", aborting the
  deploy.

The reconciler closes that loop: when CI sees a pending migration whose work
is already in the schema, it stamps the ledger row instead of re-running the
SQL.

## Recovery runbook — ledger out of sync with live schema

### Happy path (the reconciler does it for you)

The vast majority of drift cases — the same one that broke the deploy
originally — are now handled by the **"Reconcile D1 migrations ledger"** step
in `.github/workflows/deploy.yml`. You should see lines like:

```
[reconcile-d1] STAMPED 0011_files_folder.sql (all schema changes already present)
```

in the GitHub Actions log on the deploy that recovers from drift, and on
every subsequent deploy:

```
[reconcile-d1] ledger is in sync — nothing to do
```

If a deploy is currently failing in the "Apply D1 migrations" step, simply
re-running the workflow (`gh workflow run deploy.yml` or push an empty commit)
will run the reconciler first and self-heal.

### Manual investigation

If you need to look at the state by hand (you'll need
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set, same secrets CI
uses):

```bash
# What does CI think still needs to run?
npx wrangler d1 migrations list savvy-admin --remote \
  --config wrangler-workers.toml

# What does the database actually believe is applied?
npx wrangler d1 execute savvy-admin --remote --config wrangler-workers.toml \
  --command "SELECT id, name, applied_at FROM d1_migrations ORDER BY id;"

# Spot-check a "pending" migration against the live schema.
# Example: does admin_files already have the 'folder' column from 0011?
npx wrangler d1 execute savvy-admin --remote --config wrangler-workers.toml \
  --command "PRAGMA table_info(admin_files);"

# Run the reconciler locally without writing anything:
node script/reconcile-d1-migrations.mjs \
  --database savvy-admin \
  --config wrangler-workers.toml \
  --dry-run
```

### Manual reconciliation as a last resort

If the reconciler refuses to stamp a migration (e.g. because it contains a
non-idempotent `INSERT` that was already applied by hand and we can't tell
that from the schema), you can stamp the ledger manually:

```bash
npx wrangler d1 execute savvy-admin --remote --config wrangler-workers.toml \
  --command "INSERT OR IGNORE INTO d1_migrations (name, applied_at)
             VALUES ('NNNN_some_migration.sql', datetime('now'));"
```

Then re-run the deploy. **Do not** ALTER the live schema by hand to "make
the migration apply"; if drift is unavoidable, stamp the ledger and move on.

### After recovery — verify CI is healthy

The deploy pipeline ends with a **"Verify ledger and schema agree
(post-apply)"** step that re-runs the reconciler in `--dry-run
--require-in-sync` mode. A healthy deploy ends with:

```
[reconcile-d1] ledger is in sync — nothing to do
```

`--require-in-sync` makes the step **fail the build** (exit code 2) if
anything is still pending after `wrangler d1 migrations apply`, so a silent
"we'll just live with the drift" outcome is not possible — the next deploy
will block until the drift is investigated.

## Limitations of the reconciler

The reconciler only covers **schema-ahead drift** (the schema has
changes that the ledger doesn't know about — the failure mode this task
was created for). It does NOT handle:

- **Ledger-ahead drift** — a row in `d1_migrations` for a migration whose
  schema work was somehow rolled back, or for a `.sql` file that has been
  deleted from the repo. Both situations are surfaced as a `WARNING:` line
  in the reconciler output, but the script does not try to repair them; if
  you see one, investigate by hand.
- **Pure data migrations whose data has already been written by some other
  path** — the reconciler can't tell from the schema whether an
  `UPDATE`/`INSERT` has run, so those files are always re-applied by
  wrangler. Keep DML migrations idempotent (`INSERT OR IGNORE`,
  `ON CONFLICT DO NOTHING`, `UPDATE`) so re-applying is safe.

## Cheat sheet

| Task                                          | Command                                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| List local migration files                    | `ls migrations/`                                                                                       |
| List what wrangler thinks is pending          | `npx wrangler d1 migrations list savvy-admin --remote --config wrangler-workers.toml`                  |
| Show ledger rows                              | `npx wrangler d1 execute savvy-admin --remote --config wrangler-workers.toml --command "SELECT * FROM d1_migrations ORDER BY id;"` |
| Reconcile (dry run, no writes)                | `node script/reconcile-d1-migrations.mjs --database savvy-admin --config wrangler-workers.toml --dry-run` |
| Reconcile (write missing ledger rows)         | `node script/reconcile-d1-migrations.mjs --database savvy-admin --config wrangler-workers.toml`        |
| Apply pending migrations                      | `npx wrangler d1 migrations apply savvy-admin --remote --config wrangler-workers.toml`                 |
| Inspect a table's columns                     | `npx wrangler d1 execute savvy-admin --remote --config wrangler-workers.toml --command "PRAGMA table_info(<table>);"` |
