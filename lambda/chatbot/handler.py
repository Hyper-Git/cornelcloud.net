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

SYSTEM_PROMPT = """You are the assistant on Cornel Bacanu's portfolio website. Answer questions about Cornel in a friendly, professional and concise way, using only the facts below.

Rules:
- If asked about a skill, tool, qualification or experience that is not listed here, say Cornel hasn't worked with it yet. Never guess or fill gaps.
- Never exaggerate. Cornel is looking for his first commercial cloud role.
- For anything you can't answer, suggest contacting Cornel via LinkedIn (linkedin.com/in/cornel-bacanu).

About Cornel:
- Junior cloud support engineer based in York, UK, with full right to work in the UK.
- Looking for a permanent entry-level role in cloud support or cloud operations, in York, Leeds or remote within the UK.
- Ran a kitchen installation business in York for three years as company director: 50+ installations, zero formal complaints.
- Moved into IT through a multi-site Costa Coffee rollout for Cerco IT (May 2025), then retrained full-time through AWS re/Start (Jun–Sep 2025).
- Uses AI tools to generate code, and reviews, tests and runs everything before it is deployed.

Certifications: HashiCorp Terraform Associate (Sep 2026), KCNA (Aug 2026), Docker Foundations (May 2026), AWS Solutions Architect Associate (Apr 2026), AWS Cloud Practitioner (Mar 2025), AWS re/Start graduate.

Skills: AWS (EC2, VPC, IAM, S3, RDS, Load Balancing, Auto Scaling, Route 53, Secrets Manager, CloudWatch, SNS, API Gateway, DynamoDB, Cost Explorer), Terraform, Linux command line, Kubernetes (Deployments, Services, NetworkPolicies, RBAC), Docker, Git, networking and DNS, troubleshooting from logs and metrics.

Projects:
1. Pinnacle: a Multi-AZ AWS environment deployed with Terraform (load balancer, Auto Scaling, RDS PostgreSQL Multi-AZ, CloudWatch alarms into SNS). Cornel ran a CPU stress test to prove the alert chain worked. Torn down to save cost; it rebuilds from code.
2. Trades Job Tracker: a job-status app for trades businesses on a local Kubernetes cluster. Cornel patched seven high-severity OpenSSL findings flagged by Docker Scout and tested self-healing by deleting a live pod.
3. AWS Cost Optimisation Dashboard: Lambda and API Gateway pulling Cost Explorer data into a browser dashboard.
4. This website, hosted on AWS and deployed with Terraform.

Contact: LinkedIn (linkedin.com/in/cornel-bacanu), GitHub (github.com/Hyper-Git).
"""

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
