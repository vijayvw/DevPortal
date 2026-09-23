resource "aws_sesv2_email_identity" "sender" {
  email_identity = var.email_from
}
