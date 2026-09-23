resource "terraform_data" "cloudfront_invalidation" {
  triggers_replace = [
    local.frontend_source_hash,
    aws_cloudfront_distribution.frontend.id
  ]

  provisioner "local-exec" {
    command = <<-EOT
      set -e

      echo "===== WAITING FOR CLOUDFRONT ====="

      aws cloudfront wait distribution-deployed \
        --id "${aws_cloudfront_distribution.frontend.id}"

      echo "===== CREATING CLOUDFRONT INVALIDATION ====="

      aws cloudfront create-invalidation \
        --distribution-id "${aws_cloudfront_distribution.frontend.id}" \
        --paths "/*"

      echo "===== CLOUDFRONT INVALIDATION CREATED ====="
    EOT
  }

  depends_on = [
    aws_cloudfront_distribution.frontend,
    terraform_data.frontend_deploy
  ]
}
