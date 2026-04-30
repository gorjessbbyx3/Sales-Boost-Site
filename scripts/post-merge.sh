#!/bin/bash
set -e

# Post-merge setup for the TechSavvy admin CRM.
# Runs after a task agent's branch is merged into main.
# Must be idempotent and non-interactive (stdin is closed).

echo "[post-merge] Installing npm dependencies..."
npm install --no-audit --no-fund --no-progress

echo "[post-merge] Syncing local Postgres dev schema (drizzle push)..."
# --force so additive column changes don't block on data-loss prompts.
npm run db:push -- --force || npm run db:push --force || true

echo "[post-merge] Done."
