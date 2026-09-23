variable "aws_region" {
  description = "AWS region for the application"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "devportal"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Primary portfolio domain"
  type        = string
  default     = "vijayvw.in"
}

variable "www_domain_name" {
  description = "WWW portfolio domain"
  type        = string
  default     = "www.vijayvw.in"
}

variable "frontend_bucket_name" {
  description = "Private S3 bucket for the frontend"
  type        = string
}

variable "media_bucket_name" {
  description = "S3 bucket for uploaded media"
  type        = string
}

variable "artifact_bucket_name" {
  description = "S3 bucket for Lambda deployment artifacts"
  type        = string
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "DevPortal"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "DevPortalBackend"
}

variable "lambda_role_name" {
  description = "Lambda execution role name"
  type        = string
  default     = "DevPortalLambdaExecutionRole"
}

variable "api_name" {
  description = "API Gateway API name"
  type        = string
  default     = "DevPortalAPI"
}

variable "jwt_access_secret" {
  description = "JWT access token secret"
  type        = string
  sensitive   = true
}

variable "jwt_refresh_secret" {
  description = "JWT refresh token secret"
  type        = string
  sensitive   = true
}

variable "allowed_origins" {
  description = "Allowed frontend origins for CORS"
  type        = list(string)

  default = [
    "https://vijayvw.in",
    "https://www.vijayvw.in"
  ]
}

variable "email_from" {
  description = "Verified SES sender email address"
  type        = string
  default     = "vijayvw001@gmail.com"
}

variable "database_backup_path" {
  description = "Path to the DynamoDB backup JSON"
  type        = string
  default     = "../backup/DevPortal-Terraform-Test-before-destroy.json"
}

variable "media_backup_path" {
  description = "Path to the backed-up media directory"
  type        = string
  default     = "../backup/media-before-final/mumbai/media"
}
