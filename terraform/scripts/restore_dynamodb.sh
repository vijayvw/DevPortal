#!/bin/bash
set -euo pipefail

BACKUP_FILE="$1"
TABLE_NAME="$2"
REGION="$3"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: DynamoDB backup not found:"
  echo "$BACKUP_FILE"
  exit 1
fi

echo "===== RESTORING DYNAMODB ====="
echo "Backup : $BACKUP_FILE"
echo "Table  : $TABLE_NAME"
echo "Region : $REGION"

python3 - "$BACKUP_FILE" "$TABLE_NAME" "$REGION" <<'PY'
import json
import os
import subprocess
import sys
import tempfile
import time

backup_file = sys.argv[1]
table_name = sys.argv[2]
region = sys.argv[3]

with open(backup_file, "r", encoding="utf-8") as f:
    data = json.load(f)

if isinstance(data, dict) and "Items" in data:
    items = data["Items"]
elif isinstance(data, list):
    items = data
else:
    raise SystemExit("Unsupported DynamoDB backup format")

if not isinstance(items, list):
    raise SystemExit("Backup Items must be a list")

print(f"Items found: {len(items)}")

for start in range(0, len(items), 25):
    batch = items[start:start + 25]

    # IMPORTANT:
    # --request-items expects the table-name map directly.
    request_items = {
        table_name: [
            {
                "PutRequest": {
                    "Item": item
                }
            }
            for item in batch
        ]
    }

    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".json",
        delete=False,
        encoding="utf-8",
    ) as tmp:
        json.dump(request_items, tmp, ensure_ascii=False)
        tmp_path = tmp.name

    try:
        retries = 0

        while True:
            process = subprocess.run(
                [
                    "aws",
                    "dynamodb",
                    "batch-write-item",
                    "--request-items",
                    f"file://{tmp_path}",
                    "--region",
                    region,
                    "--output",
                    "json",
                ],
                capture_output=True,
                text=True,
            )

            if process.returncode != 0:
                print("AWS CLI ERROR:", file=sys.stderr)
                print(process.stderr, file=sys.stderr)
                raise SystemExit(process.returncode)

            response = json.loads(process.stdout or "{}")
            unprocessed = response.get("UnprocessedItems", {})

            if not unprocessed:
                break

            retries += 1

            if retries > 10:
                raise SystemExit(
                    "Unprocessed DynamoDB items remain after 10 retries"
                )

            with open(tmp_path, "w", encoding="utf-8") as f:
                json.dump(unprocessed, f, ensure_ascii=False)

            time.sleep(min(2 ** retries, 10))

        print(f"Restored {min(start + 25, len(items))}/{len(items)}")

    finally:
        try:
            os.remove(tmp_path)
        except FileNotFoundError:
            pass

print("===== DYNAMODB RESTORE COMPLETE =====")
PY
