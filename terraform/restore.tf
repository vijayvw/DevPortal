resource "terraform_data" "restore_database" {
  triggers_replace = filebase64sha256(var.database_backup_path)

  provisioner "local-exec" {
    command = "${path.module}/scripts/restore_dynamodb.sh '${abspath(var.database_backup_path)}' '${aws_dynamodb_table.devportal.name}' '${var.aws_region}'"
  }

  depends_on = [
    aws_dynamodb_table.devportal
  ]
}

resource "terraform_data" "restore_media" {
  triggers_replace = local.media_backup_hash

  provisioner "local-exec" {
    command = "aws s3 sync '${abspath(var.media_backup_path)}' 's3://${aws_s3_bucket.media.bucket}/media/' --region '${var.aws_region}'"
  }

  depends_on = [
    aws_s3_bucket.media
  ]
}
