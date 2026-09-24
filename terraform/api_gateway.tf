################################################################################
# API Gateway v2 (HTTP API)
################################################################################

resource "aws_apigatewayv2_api" "portfolio" {
  name          = "cornelcloud-api"
  protocol_type = "HTTP"
  description   = "Portfolio API - contact form and chatbot"

  cors_configuration {
    allow_origins = [
      "https://cornelcloud.net",
      "https://www.cornelcloud.net",
      "https://${aws_cloudfront_distribution.website.domain_name}"
    ]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type"]
    max_age       = 3600
  }

  tags = {
    Name = "cornelcloud-api"
  }
}

# ── Integrations ──────────────────────────────────────────────────────────────

resource "aws_apigatewayv2_integration" "contact" {
  api_id                 = aws_apigatewayv2_api.portfolio.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "chatbot" {
  api_id                 = aws_apigatewayv2_api.portfolio.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.chatbot.invoke_arn
  payload_format_version = "2.0"
}

# ── Routes ────────────────────────────────────────────────────────────────────

resource "aws_apigatewayv2_route" "contact" {
  api_id    = aws_apigatewayv2_api.portfolio.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.contact.id}"
}

resource "aws_apigatewayv2_route" "chatbot" {
  api_id    = aws_apigatewayv2_api.portfolio.id
  route_key = "POST /chat"
  target    = "integrations/${aws_apigatewayv2_integration.chatbot.id}"
}

# ── Stage ─────────────────────────────────────────────────────────────────────

resource "aws_apigatewayv2_stage" "api" {
  api_id      = aws_apigatewayv2_api.portfolio.id
  name        = "$default"
  auto_deploy = true

  # Throttling caps how fast the API can be called in total (not per visitor).
  # It protects the Bedrock bill and the SES sending quota from scripted abuse.
  # Callers over the limit get HTTP 429 and never reach Lambda.
  default_route_settings {
    throttling_rate_limit  = 5
    throttling_burst_limit = 10
  }

  # Each chat message is a paid Bedrock call, so it gets the tightest limit
  route_settings {
    route_key              = aws_apigatewayv2_route.chatbot.route_key
    throttling_rate_limit  = 1
    throttling_burst_limit = 3
  }

  # A real visitor sends one contact message, not dozens
  route_settings {
    route_key              = aws_apigatewayv2_route.contact.route_key
    throttling_rate_limit  = 0.2
    throttling_burst_limit = 2
  }

  tags = {
    Name = "cornelcloud-api-stage"
  }
}
