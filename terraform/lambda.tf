################################################################################
# Lambda Functions
################################################################################

# Chatbot model. Haiku is right-sized for answering from a fixed fact list:
# about 5x cheaper per message than Opus and faster to respond.
locals {
  chatbot_model_id          = "anthropic.claude-haiku-4-5-20251001-v1:0"
  chatbot_inference_profile = "eu.${local.chatbot_model_id}" # EU cross-region inference
}

# ── Package Lambda source files ───────────────────────────────────────────────

data "archive_file" "contact" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/contact"
  output_path = "${path.module}/../lambda/contact.zip"
}

data "archive_file" "chatbot" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/chatbot"
  output_path = "${path.module}/../lambda/chatbot.zip"
}

# ── Contact Lambda ─────────────────────────────────────────────────────────────

resource "aws_lambda_function" "contact" {
  function_name    = "cornelcloud-contact"
  filename         = data.archive_file.contact.output_path
  source_code_hash = data.archive_file.contact.output_base64sha256
  role             = aws_iam_role.lambda_contact.arn
  handler          = "handler.lambda_handler"
  runtime          = "python3.12"
  timeout          = 10

  environment {
    variables = {
      FROM_EMAIL = var.from_email
      TO_EMAIL   = var.contact_email
    }
  }

  tags = {
    Name = "cornelcloud-contact"
  }
}

resource "aws_lambda_permission" "contact_api" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.portfolio.execution_arn}/*"
}

# ── Chatbot Lambda ─────────────────────────────────────────────────────────────

resource "aws_lambda_function" "chatbot" {
  function_name    = "cornelcloud-chatbot"
  filename         = data.archive_file.chatbot.output_path
  source_code_hash = data.archive_file.chatbot.output_base64sha256
  role             = aws_iam_role.lambda_chatbot.arn
  handler          = "handler.lambda_handler"
  runtime          = "python3.12"
  timeout          = 30

  environment {
    variables = {
      DYNAMODB_TABLE   = aws_dynamodb_table.chat_sessions.name
      BEDROCK_MODEL_ID = local.chatbot_inference_profile
    }
  }

  tags = {
    Name = "cornelcloud-chatbot"
  }
}

resource "aws_lambda_permission" "chatbot_api" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.portfolio.execution_arn}/*"
}
