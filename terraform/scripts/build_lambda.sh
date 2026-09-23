#!/bin/bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
ZIP_PATH="$BACKEND_DIR/.terraform-lambda.zip"

echo "===== BUILDING BACKEND ====="
echo "Backend: $BACKEND_DIR"

cd "$BACKEND_DIR"

rm -rf dist
rm -f "$ZIP_PATH"

echo "Installing dependencies..."
npm ci

echo "Running typecheck..."
npm run typecheck

echo "Building TypeScript..."
npm run build

echo "Creating Lambda ZIP..."
zip -qr "$ZIP_PATH" dist node_modules package.json

echo "Lambda package created:"
ls -lh "$ZIP_PATH"

echo "===== BACKEND BUILD COMPLETE ====="
