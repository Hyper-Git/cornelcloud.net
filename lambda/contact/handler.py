import json
import os
import html
import boto3
from botocore.exceptions import ClientError

ses = boto3.client("ses", region_name=os.environ.get("AWS_REGION", "eu-west-1"))

FROM_EMAIL = os.environ["FROM_EMAIL"]
TO_EMAIL   = os.environ["TO_EMAIL"]


def lambda_handler(event, context):
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }

    try:
        body = json.loads(event.get("body") or "{}")
        name    = html.escape(body.get("name", "").strip())
        email   = html.escape(body.get("email", "").strip())
        message = html.escape(body.get("message", "").strip())

        if not all([name, email, message]):
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "name, email, and message are required"}),
            }

        ses.send_email(
            Source=FROM_EMAIL,
            Destination={"ToAddresses": [TO_EMAIL]},
            Message={
                "Subject": {"Data": f"New Portfolio Contact from {name}"},
                "Body": {
                    "Text": {
                        "Data": (
                            f"Name:    {name}\n"
                            f"Email:   {email}\n\n"
                            f"Message:\n{message}\n"
                        )
                    },
                    "Html": {
                        "Data": f"""
                        <html><body style="font-family:sans-serif;color:#333">
                        <h2 style="color:#00d4ff">New Portfolio Contact</h2>
                        <table>
                          <tr><td><strong>Name</strong></td><td>{name}</td></tr>
                          <tr><td><strong>Email</strong></td><td><a href="mailto:{email}">{email}</a></td></tr>
                        </table>
                        <h3>Message</h3>
                        <p style="white-space:pre-wrap">{message}</p>
                        </body></html>
                        """
                    },
                },
            },
        )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"message": "Email sent successfully"}),
        }

    except ClientError as e:
        print(f"SES error: {e}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": "Failed to send email"}),
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": "Internal server error"}),
        }
