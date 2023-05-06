#FILE ./functions/create-obituary/main.py
import json
import os
import uuid
import time
import hashlib
import boto3
import requests
from requests_toolbelt.multipart import decoder

# Set up AWS resources
dynamodb = boto3.resource('dynamodb')
ssm = boto3.client('ssm')
polly = boto3.client('polly')

# DONE Get required parameters from SSM Parameter Store
cloudinary_cloud_name = ssm.get_parameter(Name='/cloudinary/cloud_name', WithDecryption=True)['Parameter']['Value']
cloudinary_api_key = ssm.get_parameter(Name='/cloudinary/api_key', WithDecryption=True)['Parameter']['Value']
cloudinary_api_secret = ssm.get_parameter(Name='/cloudinary/api_secret', WithDecryption=True)['Parameter']['Value']
chatgpt_api_key = ssm.get_parameter(Name='/chatgpt/api_key', WithDecryption=True)['Parameter']['Value']


# Set up ChatGPT and Cloudinary URLs
chatgpt_url = "https://api.openai.com/v1/engines/davinci-codex/completions"
cloudinary_base_url = f"https://api.cloudinary.com/v1_1/{cloudinary_cloud_name}/image/upload"

def generate_obituary(name, born_year, died_year):
    # Step 2, Generate chatGPT description using specified parameters
    headers = {
        "Authorization": f"Bearer {chatgpt_api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "prompt": f"write an obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}.",
        "max_tokens": 600
    }

    response = requests.post(chatgpt_url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["text"]

def text_to_speech(text):
    #Step 3 take the chatGPT input and synthesize a narration of the text using amazon Polly.
    response = polly.synthesize_speech(
        OutputFormat='mp3',
        Text=text,
        VoiceId='Joanna'
    )
    return response['AudioStream'].read()

def upload_to_cloudinary(file, file_type, public_id):
    headers = {
        "Content-Type": file_type
    }
    data = {
        "api_key": cloudinary_api_key,
        "timestamp": int(time.time()),
        "public_id": public_id
    }
    data['signature'] = generate_cloudinary_signature(data)

    response = requests.post(cloudinary_base_url, headers=headers, data=data, files={"file": file})
    response.raise_for_status()
    return response.json()["secure_url"]

def generate_cloudinary_signature(params):
    signature_string = ""
    for key in sorted(params):
        signature_string += f"{key}={params[key]}&"
    signature_string += cloudinary_api_secret
    return hashlib.sha1(signature_string.encode()).hexdigest()

def save_obituary(obituary):
    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])
    response = table.put_item(Item=obituary)
    return response

def handler(event, context):
    # Extract required fields from the event object
    name = event['name']
    born_year = event['born_year']
    died_year = event['died_year']
    image = event['image']
    image_type = event['image_type']

    # Generate obituary text
    obituary_text = generate_obituary(name, born_year, died_year)

    # Convert obituary text to speech
    obituary_speech = text_to_speech(obituary_text)

    # Upload obituary image to Cloudinary
    image_public_id = f"obituary_images/{uuid.uuid4()}"
    obituary_image_url = upload_to_cloudinary(image, image_type, image_public_id)

    # Upload obituary speech to Cloudinary
    speech_public_id = f"obituary_speeches/{uuid.uuid4()}"
    obituary_speech_url = upload_to_cloudinary(obituary_speech, "audio/mpeg", speech_public_id)

    # Save obituary to DynamoDB
    obituary = {
        "id": str(uuid.uuid4()),
        "name": name,
        "born_year": born_year,
        "died_year": died_year,
        "obituary_text": obituary_text,
        "obituary_image_url": obituary_image_url,
        "obituary_speech_url": obituary_speech_url,
    }
    save_obituary(obituary)

    # Return successful response
    response = {
        "statusCode": 201,
        "body": json.dumps({"message": "Obituary created successfully."}),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
        },
    }

    return response



