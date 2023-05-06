#FILE ./functions/get-obituaries/main.py
import json
import os
import boto3

# Set up AWS resources
dynamodb = boto3.resource('dynamodb')

def fetch_obituaries(limit=None):
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    scan_kwargs = {}
    if limit:
        scan_kwargs['Limit'] = limit
    response = table.scan(**scan_kwargs)
    return response['Items']

def handler(event, context):
    limit = event.get('queryStringParameters', {}).get('limit')
    if limit:
        limit = int(limit)
    obituaries = fetch_obituaries(limit)
    response = {
        "statusCode": 200,
        "body": json.dumps(obituaries),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
        },
    }
    return response
