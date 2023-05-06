#FILE: ./infra/main.tf
terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

locals {
  daniel_ucid = "30158835"
  tahmeed_ucid = "30158740"
}

resource "aws_dynamodb_table" "obituaries_table" {
  name           = "obituaries-tahmeed-${local.tahmeed_ucid}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "obituaries-table"
  }
}

resource "aws_lambda_function" "get_obituaries" {
  function_name = "get-obituaries-daniel-${local.daniel_ucid}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  runtime       = "python3.8"
  timeout       = 20

  filename = "C:\\Users\\tahme\\Documents\\GitHub\\the-last-show-daniel-and-tahmeed\\functions\\get-obituaries\\get_obituaries_lambda_function.zip"



  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.obituaries_table.name
    }
  }

  tags = {
    Name = "get-obituaries-lambda"
  }
}

resource "aws_lambda_function" "create_obituary" {
  function_name = "create-obituary-daniel-${local.daniel_ucid}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.handler"
  runtime       = "python3.8"
  timeout       = 20

  filename = "C:\\Users\\tahme\\Documents\\GitHub\\the-last-show-daniel-and-tahmeed\\functions\\create-obituary\\create_obituary_lambda_function.zip"


  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.obituaries_table.name
    }
  }

  tags = {
    Name = "create-obituary-lambda"
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_exec" {
  name = "lambda_exec"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "ssm:GetParametersByPath"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}















resource "aws_lambda_function_url" "get_obituaries_url" {
  function_name      = aws_lambda_function.get_obituaries.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


resource "aws_lambda_function_url" "create_obituary_url" {
  function_name      = aws_lambda_function.create_obituary.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


output "table_name" {
  value = aws_dynamodb_table.obituaries_table.name
}

output "get_obituaries_url" {
  value = aws_lambda_function_url.get_obituaries.invoke.arn
}

output "create_obituary_url" {
  value = aws_lambda_function_url.invoke.arn
}
