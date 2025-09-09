#!/usr/bin/env python3
"""
Test script for the Persona Extraction API
"""

import requests
import json

# API endpoint
API_URL = "http://localhost:8000/persona"

# Sample data matching the expected JSON format
sample_data = {
    "transcripts": [
        {
            "videoId": "abcde12345",
            "transcript": "Hello everyone! Welcome to my channel. Today we're going to be doing something absolutely insane. I can't believe we're actually doing this. This is going to be the biggest challenge ever. Are you ready? Let's go!"
        },
        {
            "videoId": "fghij67890", 
            "transcript": "What's up guys! It's your boy back with another crazy video. I hope you're having an amazing day. Today we're talking about AI and how it's changing the world. This stuff is mind-blowing, I'm telling you. The future is here!"
        },
        {
            "videoId": "klmno11111",
            "transcript": "Yo! What's happening everyone? I'm so excited to share this with you. We just hit a major milestone and I wanted to thank each and every one of you. You guys are the best community ever. Let's keep pushing forward!"
        }
    ]
}

def test_persona_extraction():
    """Test the persona extraction endpoint"""
    try:
        print("🚀 Testing Persona Extraction API...")
        print(f"📤 Sending {len(sample_data['transcripts'])} transcripts...")
        
        # Make the API request
        response = requests.post(API_URL, json=sample_data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Success! Persona extracted:")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the API server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Health check failed: Server not running")

if __name__ == "__main__":
    print("🧪 Testing Persona Extraction API")
    print("=" * 50)
    
    # Test health check first
    test_health_check()
    print()
    
    # Test persona extraction
    test_persona_extraction()
