################################################################################
# IAM - Lambda Execution Roles
################################################################################

data "aws_caller_identity" "current" {}

# ── Shared assume-role policy for Lambda ──────────────────────────────────────

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# ── Contact Lambda role ───────────────────────────────────────────────────────

resource "aws_iam_role" "lambda_contact" {
  name               = "cornelcloud-lambda-contact"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_contact_basic" {
  role       = aws_iam_role.lambda_contact.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_contact_ses" {
  name = "ses-send-email"
  role = aws_iam_role.lambda_contact.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "ses:SendEmail"
      Resource = "arn:aws:ses:eu-west-1:${data.aws_caller_identity.current.account_id}:identity/cornelcloud.net"
    }]
  })
}

# ── Chatbot Lambda role ───────────────────────────────────────────────────────

resource "aws_iam_role" "lambda_chatbot" {
  name               = "cornelcloud-lambda-chatbot"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_chatbot_basic" {
  role       = aws_iam_role.lambda_chatbot.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_chatbot_bedrock" {
  name = "bedrock-invoke"
  role = aws_iam_role.lambda_chatbot.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "bedrock:InvokeModel"
      Resource = "arn:aws:bedrock:eu-west-1::foundation-model/anthropic.claude-opus-4-5-20251101-v1:0"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_chatbot_dynamodb" {
  name = "dynamodb-chat-sessions"
  role = aws_iam_role.lambda_chatbot.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:Query",
        "dynamodb:PutItem"
      ]
      Resource = aws_dynamodb_table.chat_sessions.arn
    }]
  })
}
