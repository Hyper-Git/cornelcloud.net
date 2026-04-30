################################################################################
# Terraform Variables Values
################################################################################

aws_region     = "eu-west-1"
domain_name    = "cornelcloud.net"
bucket_name    = "cornelcloud-website"

# Route 53 Hosted Zone ID for cornelcloud.net
hosted_zone_id = "Z01393483HVF6KCHJNO5V"

# DNS Toggle - Set to false for testing, true when ready to go live
# When false: Your existing site stays live, test via CloudFront URL
# When true:  Route 53 records updated to point to new infrastructure
update_dns = true

contact_email = "contact@cornelcloud.net"
from_email    = "noreply@cornelcloud.net"
