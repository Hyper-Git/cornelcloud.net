# cornelcloud.net Infrastructure

[![Deploy Portfolio](https://github.com/Hyper-Git/cornelcloud.net/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hyper-Git/cornelcloud.net/actions/workflows/deploy.yml)

Cloud portfolio infrastructure for [cornelcloud.net](https://cornelcloud.net), built with **Terraform** and deployed via **GitHub Actions**. The site is a live AWS environment — not just a static page, but a serverless backend with an AI chatbot powered by Amazon Bedrock.

## Architecture

> **Interactive diagram:** [`docs/cornelcloud-portfolio-architecture.drawio`](docs/cornelcloud-portfolio-architecture.drawio) — open with [draw.io](https://app.diagrams.net) or the VS Code draw.io extension.

### Data Flow

```
  User
   │
   ├─1─▶  Route 53 (cornelcloud.net A/AAAA alias)
   │           │
   ├─2─▶  CloudFront  ◀── ACM cert (us-east-1)
   │       │       │
   │      OAC    CORS
   │       │       │
   ├─3─▶  S3      API Gateway v2 (HTTP API)  ◀─5─ User (POST /contact, POST /chat)
   │    (static)    │               │
   │               6a              6b
   │                │               │
   │         contact Lambda    chatbot Lambda
   │         Python 3.12       Python 3.12 · 30s
   │                │               │           │
   │               7a              7b           8
   │                │               │           │
   │              SES           Bedrock      DynamoDB
   │          (send email)   (Claude Opus   (chat sessions
   │                          4.5 EU)        24h TTL)
   │
   ├──  CI/CD: GitHub Actions → Terraform apply → S3 sync → CF invalidation
   └──  IAM:   least-privilege roles per Lambda · OIDC (no static keys)
```

### Services

| # | Service | Role |
|---|---------|------|
| 1 | Route 53 | DNS — A/AAAA alias to CloudFront |
| 2 | CloudFront + ACM | CDN, HTTPS, OAC · PriceClass_100 |
| 3 | S3 | Private static website · SSE-S3 · versioning |
| 4 | S3 (tf-state) | Terraform remote state backend |
| 5 | API Gateway v2 | HTTP API — `POST /contact`, `POST /chat` |
| 6a | Lambda (contact) | Validates form input, calls SES |
| 6b | Lambda (chatbot) | Loads history, calls Bedrock, saves reply |
| 7a | SES | Sends contact email to `contact@cornelcloud.net` |
| 7b | Bedrock | Claude Opus 4.5 via EU cross-region inference profile |
| 8 | DynamoDB | Chat session history · PAY_PER_REQUEST · 24h TTL |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Infrastructure as Code | Terraform 1.12 |
| CI/CD | GitHub Actions (OIDC auth) |
| Static Hosting | AWS S3 |
| CDN | AWS CloudFront |
| DNS | AWS Route 53 |
| SSL/TLS | AWS Certificate Manager |
| Serverless Compute | AWS Lambda (Python 3.12) |
| API Layer | AWS API Gateway v2 (HTTP) |
| AI / LLM | Amazon Bedrock — Claude Opus 4.5 (EU inference profile) |
| Chat Storage | AWS DynamoDB (sessions with TTL) |
| Email | AWS SES |
| IAM | Least-privilege roles per Lambda |
| Terraform State | AWS S3 (remote backend) |

## Project Structure

```
cornelcloud-infrastructure/
├── terraform/
│   ├── main.tf           # Provider & backend config
│   ├── variables.tf      # Input variables
│   ├── outputs.tf        # Output values
│   ├── s3.tf             # Website bucket
│   ├── cloudfront.tf     # CDN distribution
│   ├── acm.tf            # SSL certificate
│   ├── route53.tf        # DNS records
│   ├── api_gateway.tf    # HTTP API Gateway
│   ├── lambda.tf         # Lambda functions + packaging
│   ├── dynamodb.tf       # Chat sessions table
│   └── iam.tf            # IAM roles & policies
├── lambda/
│   ├── chatbot/
│   │   └── handler.py    # Bedrock chat handler
│   └── contact/
│       └── handler.py    # SES contact form handler
├── website/
│   ├── index.html        # Main portfolio page
│   └── presentation.html # Interactive 3D presentation
├── .github/
│   └── workflows/
│       └── deploy.yml    # CI/CD pipeline
└── README.md
```

## Deployment

### Prerequisites

- AWS account with an OIDC identity provider configured for GitHub Actions
- Terraform state bucket: `cornel-terraform-bucket`
- Route 53 hosted zone for `cornelcloud.net`
- SES identity verified for `cornelcloud.net`
- Amazon Bedrock model access enabled for `anthropic.claude-opus-4-5-20251101-v1:0` in eu-west-1

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AWS_ROLE_ARN` | ARN of the IAM role GitHub Actions assumes via OIDC |

> Authentication uses OIDC (no static keys stored as secrets).

### Automated Deployment

Every push to `main` triggers:

1. Terraform validates and applies infrastructure changes
2. API URL is injected into `index.html`
3. Website files sync to S3 (with appropriate cache headers)
4. CloudFront cache invalidation

Pull requests to `main` trigger a Terraform plan only (no apply).

### Manual Deployment

```bash
cd terraform
terraform init
terraform plan
terraform apply

# Deploy website (replace with actual bucket name from tf output)
aws s3 sync ../website s3://$(terraform output -raw website_bucket_name) --delete
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

## Lambda Functions

### Chatbot (`/chat`)

- Accepts `POST { "message": "...", "session_id": "..." }`
- Loads conversation history from DynamoDB (last 10 messages)
- Calls Amazon Bedrock using the EU cross-region inference profile
- Saves user + assistant messages with 24h TTL
- Returns `{ "response": "..." }`

### Contact (`/contact`)

- Accepts `POST { "name": "...", "email": "...", "message": "..." }`
- Sends email via SES to `contact@cornelcloud.net`
- Returns 200 on success

## IAM Design

Each Lambda has a dedicated least-privilege role:

| Role | Permissions |
|------|-------------|
| `cornelcloud-lambda-chatbot` | `bedrock:InvokeModel` on EU inference profile + underlying foundation model, `aws-marketplace:ViewSubscriptions` + `aws-marketplace:Subscribe` for model access verification, `dynamodb:Query` + `dynamodb:PutItem` on chat sessions table |
| `cornelcloud-lambda-contact` | `ses:SendEmail` on `cornelcloud.net` SES identity |

## Security

- S3 bucket is private — CloudFront access via Origin Access Control only
- HTTPS enforced with TLS 1.2+
- GitHub Actions uses OIDC (no long-lived AWS credentials)
- Lambda roles are scoped to specific resources, not wildcards
- DynamoDB chat sessions auto-expire after 24 hours (TTL)

## Cost Estimate

| Service | Estimated Cost |
|---------|---------------|
| S3 | ~$0.023/GB + requests |
| CloudFront | Free tier: 1TB/month |
| Route 53 | $0.50/hosted zone/month |
| ACM | Free |
| Lambda | Free tier: 1M requests/month |
| API Gateway | Free tier: 1M requests/month |
| DynamoDB | Free tier: 25GB + 25 WCU/RCU |
| Bedrock | Per token (Claude Opus 4.5 pricing) |

**Estimated monthly cost: < $5** for typical portfolio traffic (excluding Bedrock tokens).

## Notes

- Email DNS records (MX, SPF, DKIM, DMARC) are managed outside Terraform to preserve the existing SES configuration
- CloudFront distribution deployment takes ~10–15 minutes on first apply
- The Bedrock model requires the EU cross-region inference profile (`eu.anthropic.claude-opus-4-5-20251101-v1:0`) — direct on-demand invocation is not supported for this model

---

Built by [Cornel Bacanu](https://cornelcloud.net)
