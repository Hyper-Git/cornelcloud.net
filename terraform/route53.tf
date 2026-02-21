################################################################################
# Route 53 DNS Records
################################################################################

# Note: The hosted zone itself is NOT managed by Terraform
# We only manage the records that point to our new infrastructure
# Email records (MX, SPF, DKIM, DMARC) are preserved manually

# A Record - IPv4 pointing to CloudFront
# Only created when update_dns = true
resource "aws_route53_record" "website_a" {
  count = var.update_dns ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA Record - IPv6 pointing to CloudFront
# Only created when update_dns = true
resource "aws_route53_record" "website_aaaa" {
  count = var.update_dns ? 1 : 0

  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

################################################################################
# IMPORTANT: Email Records (Managed Outside Terraform)
################################################################################
# The following records exist in your hosted zone and should NOT be modified:
# - MX record: 10 inbound-smtp.eu-west-1.amazonaws.com
# - TXT record (SPF): "v=spf1 include:amazonses.com ~all"
# - TXT record (DMARC): "v=DMARC1; p=none;"
# - CNAME records (DKIM): _domainkey records for SES
# - CNAME record: autodiscover.cornelcloud.net
#
# These are left unmanaged to preserve your email functionality.
# If you need to manage them via Terraform in the future, import them first.
################################################################################
