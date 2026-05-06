import json
import os
import time
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "eu-west-1"))
bedrock  = boto3.client("bedrock-runtime", region_name=os.environ.get("AWS_REGION", "eu-west-1"))

TABLE_NAME = os.environ["DYNAMODB_TABLE"]
MODEL_ID   = os.environ["BEDROCK_MODEL_ID"]

SYSTEM_PROMPT = """You are an AI assistant for Cornel Bacanu's portfolio website.
You answer questions about Cornel in a friendly, professional, and concise way.

About Cornel:
- Cloud Engineer transitioning from a background in kitchen installation project management
- Strong problem-solving skills from managing complex physical projects, now applied to cloud architecture
- Based in Europe, open to remote work globally
- Available for cloud engineering roles, freelance projects, and consulting opportunities

Skills & Technologies:
- Cloud: AWS (EC2, S3, Lambda, CloudFront, API Gateway, DynamoDB, SageMaker, Bedrock, ECS, RDS, SES, IAM, Route 53, ACM, CloudWatch)
- Infrastructure as Code: Terraform
- Containers: Docker, Kubernetes
- Languages: Python, JavaScript, Bash
- CI/CD: GitHub Actions
- Networking: VPCs, security groups, load balancers

Certifications:
- AWS Certified Cloud Practitioner (achieved)
- AWS Certified Solutions Architect Associate (achieved)
- Currently enrolled with Optima IT Academy pursuing AWS Data Engineer Associate and AWS AI/ML Associate certifications

Projects:
1. Cloud Portfolio Infrastructure — This very website. Built with Terraform, S3, CloudFront, Route 53, ACM. CI/CD via GitHub Actions.
2. AI-Powered Chatbot — Serverless chatbot (you!) built with Lambda, API Gateway, DynamoDB, and Amazon Bedrock.
3. Hackathon Backend — Serverless backend for a marketplace app. Lambda, API Gateway, DynamoDB, S3.
4. Automated CI/CD Pipelines — GitHub Actions workflows deploying to AWS ECS and S3.
5. Pinnacle — Production-grade, highly available AWS infrastructure for a UK SMB web application. Multi-AZ VPC, ALB + Auto Scaling Group, RDS PostgreSQL with Secrets Manager, OIDC-based GitHub Actions CI/CD, IMDSv2 enforced, zero SSH via SSM Session Manager. Fully modular Terraform IaC across 7 modules.

Contact:
- Email: contact@cornelcloud.net
- LinkedIn: linkedin.com/in/cornel-bacanu-b7138032a
- GitHub: github.com/Hyper-Git

Keep answers concise (2-4 sentences). If asked something outside of Cornel's background,
politely redirect to what you do know about him."""

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

MAX_HISTORY = 10  # last 10 messages (5 exchanges)
TTL_SECONDS = 86400  # 24 hours


def get_history(table, session_id):
    try:
        resp = table.query(
            KeyConditionExpression=Key("session_id").eq(session_id),
            ScanIndexForward=True,
            Limit=MAX_HISTORY,
        )
        return resp.get("Items", [])
    except ClientError:
        return []


def save_messages(table, session_id, user_msg, assistant_msg):
    now = int(time.time() * 1000)  # milliseconds to avoid same-second collision
    ttl = int(now / 1000) + TTL_SECONDS
    table.put_item(Item={
        "session_id": session_id,
        "timestamp": now,
        "role": "user",
        "content": user_msg,
        "ttl": ttl,
    })
    table.put_item(Item={
        "session_id": session_id,
        "timestamp": now + 1,
        "role": "assistant",
        "content": assistant_msg,
        "ttl": ttl,
    })


def lambda_handler(event, context):
    try:
        body       = json.loads(event.get("body") or "{}")
        user_msg   = body.get("message", "").strip()
        session_id = body.get("session_id", "").strip()

        if not user_msg:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "message is required"}),
            }

        if not session_id:
            return {
                "statusCode": 400,
                "headers": HEADERS,
                "body": json.dumps({"error": "session_id is required"}),
            }

        table   = dynamodb.Table(TABLE_NAME)
        history = get_history(table, session_id)

        # Build messages for Bedrock
        messages = []
        for item in history:
            messages.append({"role": item["role"], "content": item["content"]})
        messages.append({"role": "user", "content": user_msg})

        payload = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 512,
            "system": SYSTEM_PROMPT,
            "messages": messages,
        }

        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload),
        )

        result        = json.loads(response["body"].read())
        assistant_msg = result["content"][0]["text"]

        save_messages(table, session_id, user_msg, assistant_msg)

        return {
            "statusCode": 200,
            "headers": HEADERS,
            "body": json.dumps({"response": assistant_msg}),
        }

    except ClientError as e:
        print(f"AWS error: {e}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Service error, please try again"}),
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {
            "statusCode": 500,
            "headers": HEADERS,
            "body": json.dumps({"error": "Internal server error"}),
        }
