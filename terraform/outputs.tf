output "frontend_bucket" {
  description = "Frontend S3 bucket"
  value       = aws_s3_bucket.frontend.bucket
}

output "media_bucket" {
  description = "Media S3 bucket"
  value       = aws_s3_bucket.media.bucket
}

output "dynamodb_table" {
  description = "DynamoDB table"
  value       = aws_dynamodb_table.devportal.name
}

output "lambda_function" {
  description = "Lambda function"
  value       = aws_lambda_function.backend.function_name
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = aws_apigatewayv2_api.backend.api_endpoint
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain" {
  description = "CloudFront domain"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
