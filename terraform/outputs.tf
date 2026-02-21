################################################################################
# Outputs
################################################################################

output "website_bucket_name" {
  description = "Name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.website.id
}

output "website_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.website.arn
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "test_url" {
  description = "CloudFront test URL (use this while update_dns = false)"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.website.arn
}

output "dns_update_status" {
  description = "Whether DNS records are managed by Terraform"
  value       = var.update_dns ? "ENABLED - cornelcloud.net points to new infrastructure" : "DISABLED - Test via CloudFront URL above"
}
