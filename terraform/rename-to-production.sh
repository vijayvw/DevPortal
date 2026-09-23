#!/bin/bash
set -euo pipefail

echo "===== RENAMING DEVPORTAL TO PRODUCTION ====="

FILES=(
  variables.tf
  terraform.tfvars
  locals.tf
  lambda.tf
  api_gateway.tf
  cloudfront.tf
  s3.tf
  dynamodb.tf
  iam.tf
  outputs.tf
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' \
      -e 's/terraform-test/production/g' \
      -e 's/Terraform-Test/Production/g' \
      -e 's/terraform-frontend-test/frontend/g' \
      -e 's/terraform-media-test/media/g' \
      "$file"
  fi
done

echo ""
echo "===== SETTING FINAL PRODUCTION NAMES ====="

# Update terraform.tfvars only if the variables exist.
if [ -f terraform.tfvars ]; then
  sed -i '' \
    -e 's|^environment *=.*|environment = "production"|' \
    -e 's|^frontend_bucket_name *=.*|frontend_bucket_name = "vijayvw-devportal-frontend"|' \
    -e 's|^media_bucket_name *=.*|media_bucket_name = "vijayvw-devportal-media"|' \
    -e 's|^artifact_bucket_name *=.*|artifact_bucket_name = "vijayvw-devportal-artifacts"|' \
    -e 's|^dynamodb_table_name *=.*|dynamodb_table_name = "DevPortal"|' \
    -e 's|^lambda_function_name *=.*|lambda_function_name = "DevPortalBackend"|' \
    -e 's|^lambda_role_name *=.*|lambda_role_name = "DevPortalLambdaExecutionRole"|' \
    -e 's|^api_name *=.*|api_name = "DevPortalAPI"|' \
    terraform.tfvars
fi

echo ""
echo "===== OLD TEST NAMES CHECK ====="

if grep -RniE \
  "terraform-test|Terraform-Test|frontend-test|media-test|Backend-Terraform|API-Terraform" \
  --include='*.tf' --include='*.tfvars' . 2>/dev/null; then

  echo ""
  echo "WARNING: Old test names still exist."
else
  echo "No old test names found."
fi

echo ""
echo "===== FINAL terraform.tfvars NAMES ====="

grep -E \
  'environment|frontend_bucket_name|media_bucket_name|artifact_bucket_name|dynamodb_table_name|lambda_function_name|lambda_role_name|api_name' \
  terraform.tfvars 2>/dev/null || true

echo ""
echo "===== DONE ====="
