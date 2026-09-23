#!/bin/bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

API_URL="${1:?API URL is required}"
BUCKET_NAME="${2:?S3 bucket name is required}"
AWS_REGION="${3:?AWS region is required}"

ENV_FILE="$FRONTEND_DIR/.env.production"
BACKUP_FILE="$FRONTEND_DIR/.env.production.terraform-backup"

echo "===== BUILDING FRONTEND ====="
echo "Frontend : $FRONTEND_DIR"
echo "API URL  : $API_URL"
echo "Bucket   : $BUCKET_NAME"

cd "$FRONTEND_DIR"

restore_env() {
  if [ -f "$BACKUP_FILE" ]; then
    mv -f "$BACKUP_FILE" "$ENV_FILE"
  else
    rm -f "$ENV_FILE"
  fi
}

trap restore_env EXIT

if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$BACKUP_FILE"
fi

printf 'VITE_API_BASE_URL="%s/api/v1"\n' "$API_URL" > "$ENV_FILE"

echo "Installing frontend dependencies..."
npm ci

echo "Building frontend..."
npm run build

echo "Uploading frontend to S3..."
aws s3 sync dist/ "s3://${BUCKET_NAME}/" \
  --region "$AWS_REGION" \
  --delete

echo "===== FRONTEND DEPLOYMENT COMPLETE ====="
