#!/bin/bash
# Deploy all Cloudflare Workers
# Used as the Pages deploy command

set -e

echo "=== Deploying email worker (tight-fog-5031) ==="
cd worker/email-worker
npm install
npx wrangler deploy
cd ../..

echo "=== Deploying AI worker (mojo-luna-955c) ==="
cd worker
npx wrangler deploy
cd ..

echo "=== All workers deployed ==="
