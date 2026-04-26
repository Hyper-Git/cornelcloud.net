################################################################################
# DynamoDB - Chatbot Session History
################################################################################

resource "aws_dynamodb_table" "chat_sessions" {
  name         = "cornelcloud-chat-sessions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "session_id"
  range_key    = "timestamp"

  attribute {
    name = "session_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "cornelcloud-chat-sessions"
  }
}
