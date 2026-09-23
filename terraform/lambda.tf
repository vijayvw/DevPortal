resource "terraform_data" "backend_build" {
  triggers_replace = local.backend_source_hash

  provisioner "local-exec" {
    command = "${path.module}/scripts/build_lambda.sh"

    environment = {
      BACKEND_DIR = "${path.module}/../backend"
    }
  }
}

resource "aws_s3_object" "lambda_package" {
  bucket = aws_s3_bucket.lambda_artifacts.id
  key    = "lambda/${local.backend_source_hash}.zip"
  source = "${path.module}/../backend/.terraform-lambda.zip"

  depends_on = [
    terraform_data.backend_build
  ]
}

resource "aws_lambda_function" "backend" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda.arn

  runtime = "nodejs20.x"
  handler = "dist/lambda/handler.handler"

  s3_bucket = aws_s3_bucket.lambda_artifacts.id
  s3_key    = aws_s3_object.lambda_package.key

  timeout     = 30
  memory_size = 512

  environment {
    variables = {
      NODE_ENV = "production"

      DYNAMODB_TABLE = aws_dynamodb_table.devportal.name

      AWS_S3_BUCKET = aws_s3_bucket.media.bucket

      MEDIA_BASE_URL = "https://${var.domain_name}"

      UPLOAD_DRIVER = "s3"

      EMAIL_FROM = var.email_from

      JWT_ACCESS_SECRET  = var.jwt_access_secret
      JWT_REFRESH_SECRET = var.jwt_refresh_secret

      CORS_ORIGIN = join(",", var.allowed_origins)

      API_PREFIX = "/api/v1"

      LOG_LEVEL = "info"
    }
  }

  depends_on = [
    aws_iam_role_policy.lambda,
    aws_s3_object.lambda_package
  ]
}
