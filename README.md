# cornelcloud.net Infrastructure

[![Deploy Portfolio](https://github.com/Hyper-Git/cornelcloud.net/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hyper-Git/cornelcloud.net/actions/workflows/deploy.yml)

Cloud portfolio infrastructure for [cornelcloud.net](https://cornelcloud.net), built with **Terraform** and deployed via **GitHub Actions**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Route 53                                 │
│                     cornelcloud.net                              │
│                    (A & AAAA Records)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      CloudFront                                  │
│               (CDN + SSL/TLS via ACM)                           │
│                Origin Access Control                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                       S3 Bucket                                  │
│                  (Static Website Files)                          │
│              Private - CloudFront Access Only                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Infrastructure | Terraform |
| CI/CD | GitHub Actions |
| Hosting | AWS S3 |
| CDN | AWS CloudFront |
| DNS | AWS Route 53 |
| SSL/TLS | AWS Certificate Manager |
| State Storage | AWS S3 (remote backend) |

## 📁 Project Structure

```
cornelcloud.net/
├── terraform/
│   ├── main.tf           # Provider & backend config
│   ├── variables.tf      # Input variables
│   ├── outputs.tf        # Output values
│   ├── s3.tf             # Website bucket
│   ├── cloudfront.tf     # CDN distribution
│   ├── acm.tf            # SSL certificate
│   ├── route53.tf        # DNS records
│   └── terraform.tfvars  # Variable values
├── website/
│   ├── index.html        # Main portfolio page
│   ├── presentation.html # 3D presentation scene
│   └── assets/           # Images, audio, etc.
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD pipeline
└── README.md
```

## 🚀 Deployment

### Prerequisites

1. AWS Account with appropriate permissions
2. Terraform state bucket: `cornel-terraform-bucket`
3. Route 53 hosted zone for `cornelcloud.net`

### GitHub Secrets Required

Add these secrets to your repository settings:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key with deployment permissions |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |

### Automated Deployment

Every push to `main` branch triggers:

1. ✅ Terraform validates and applies infrastructure changes
2. ✅ Website files sync to S3
3. ✅ CloudFront cache invalidation

### Manual Deployment

```bash
# Initialize Terraform
cd terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply

# Deploy website files
aws s3 sync ../website s3://cornelcloud-website --delete
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

## 🔧 Initial Setup

### 1. Get your Route 53 Hosted Zone ID

```bash
aws route53 list-hosted-zones --query "HostedZones[?Name=='cornelcloud.net.'].Id" --output text
```

### 2. Update terraform.tfvars

Replace `YOUR_HOSTED_ZONE_ID_HERE` with your actual hosted zone ID.

### 3. First-time Terraform Apply

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 4. Configure GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## 📊 Terraform Outputs

| Output | Description |
|--------|-------------|
| `website_url` | https://cornelcloud.net |
| `cloudfront_distribution_id` | For cache invalidation |
| `website_bucket_name` | S3 bucket name |

## 🔒 Security Features

- ✅ S3 bucket is **private** (no public access)
- ✅ CloudFront uses **Origin Access Control (OAC)**
- ✅ HTTPS enforced with **TLS 1.2+**
- ✅ Server-side encryption on S3
- ✅ Versioning enabled on S3

## 💰 Cost Estimate

This setup is very cost-effective:

- **S3**: ~$0.023/GB storage + requests
- **CloudFront**: Free tier covers 1TB/month
- **Route 53**: $0.50/hosted zone/month
- **ACM**: Free for public certificates

**Estimated monthly cost: < $1** for a typical portfolio site.

## 📝 Notes

- Email records (MX, SPF, DKIM, DMARC) are managed outside Terraform to preserve existing SES configuration
- CloudFront distribution deployment takes ~10-15 minutes initially
- ACM certificate validation is automatic via DNS

---

Built with ☁️ by [Cornel Bacanu](https://cornelcloud.net)
