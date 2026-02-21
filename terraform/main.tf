################################################################################
# Terraform Configuration for cornelcloud.net
# Cloud Portfolio Infrastructure
################################################################################

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "cornel-terraform-bucket"
    key     = "cornelcloud-portfolio/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}

# Primary provider - eu-west-1
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "cornelcloud-portfolio"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# US East 1 provider - Required for ACM certificates used by CloudFront
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "cornelcloud-portfolio"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}
