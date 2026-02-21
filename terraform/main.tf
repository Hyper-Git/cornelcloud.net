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

  # Remote state configuration - Cross-account access
  backend "s3" {
    bucket  = "cornel-terraform-bucket"
    key     = "cornelcloud-portfolio/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true

    assume_role = {
      role_arn = "arn:aws:iam::377977678666:role/DevelopmentAccessRole"
    }
  }
}

# Primary provider - eu-west-1 (using cross-account role)
provider "aws" {
  region = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::377977678666:role/DevelopmentAccessRole"
  }

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

  assume_role {
    role_arn = "arn:aws:iam::377977678666:role/DevelopmentAccessRole"
  }

  default_tags {
    tags = {
      Project     = "cornelcloud-portfolio"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}
