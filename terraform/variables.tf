################################################################################
# Variables
################################################################################

variable "aws_region" {
  description = "AWS region for main resources"
  type        = string
  default     = "eu-west-1"
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "cornelcloud.net"
}

variable "bucket_name" {
  description = "S3 bucket name for website hosting"
  type        = string
  default     = "cornelcloud-website"
}

# Route 53 Hosted Zone ID - We'll import the existing zone
variable "hosted_zone_id" {
  description = "Existing Route 53 Hosted Zone ID for cornelcloud.net"
  type        = string
}

# Toggle for Route 53 - Set to false initially for testing
variable "update_dns" {
  description = "Whether to update Route 53 records to point to new CloudFront. Set to false for testing."
  type        = bool
  default     = false
}

variable "contact_email" {
  description = "Email address to receive contact form submissions"
  type        = string
  default     = "contact@cornelcloud.net"
}

variable "from_email" {
  description = "Verified SES sender address for contact form emails"
  type        = string
  default     = "noreply@cornelcloud.net"
}
