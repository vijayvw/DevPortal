resource "terraform_data" "frontend_deploy" {
  triggers_replace = [
    local.frontend_source_hash,
    aws_apigatewayv2_stage.default.id
  ]

  provisioner "local-exec" {
    command = "${path.module}/scripts/build_frontend.sh '${aws_apigatewayv2_api.backend.api_endpoint}' '${aws_s3_bucket.frontend.bucket}' '${var.aws_region}'"
  }

  depends_on = [
    aws_apigatewayv2_stage.default,
    aws_s3_bucket.frontend
  ]
}
