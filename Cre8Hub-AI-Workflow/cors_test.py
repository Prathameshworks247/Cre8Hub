#!/usr/bin/env python3
"""
CORS Test Script for FastAPI Backend
Run this to test your backend endpoints and diagnose CORS issues
"""

import requests
import json
import sys

# Backend URL
BASE_URL = "http://localhost:7000"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test an endpoint and return detailed response info"""
    url = f"{BASE_URL}{endpoint}"
    
    if headers is None:
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "http://localhost:8080"
        }
    
    print(f"\n{'='*50}")
    print(f"Testing: {method} {url}")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    if data:
        print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "OPTIONS":
            response = requests.options(url, headers=headers)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        try:
            response_json = response.json()
            print(f"\nResponse Body:")
            print(json.dumps(response_json, indent=2))
        except:
            print(f"\nResponse Text: {response.text}")
        
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server is not running")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    print("🧪 FastAPI CORS Testing Script")
    print(f"Testing backend at: {BASE_URL}")
    
    tests = [
        # Test 1: Health check
        ("GET", "/health", None),
        
        # Test 2: Root endpoint
        ("GET", "/", None),
        
        # Test 3: OPTIONS preflight for generate
        ("OPTIONS", "/generate", None),
        
        # Test 4: Actual POST to generate (simple test)
        ("POST", "/generate", {
            "platform": "youtube",
            "prompt": "Test content generation",
            "personify": False,
            "iterations": 1
        }),
        
        # Test 5: OPTIONS for save_output
        ("OPTIONS", "/save_output", None),
        
        # Test 6: GET platforms
        ("GET", "/platforms", None),
    ]
    
    results = []
    
    for method, endpoint, data in tests:
        success = test_endpoint(method, endpoint, data)
        results.append((method, endpoint, success))
    
    print(f"\n{'='*50}")
    print("📊 TEST SUMMARY")
    print(f"{'='*50}")
    
    for method, endpoint, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {method} {endpoint}")
    
    # Check if backend is accessible at all
    all_failed = all(not success for _, _, success in results)
    if all_failed:
        print(f"\n❌ All tests failed. Please check:")
        print(f"1. Backend server is running on {BASE_URL}")
        print(f"2. No firewall blocking the connection")
        print(f"3. Correct port (7000) is being used")
    
    # CORS-specific advice
    cors_tests = [r for method, endpoint, r in results if method == "OPTIONS"]
    if cors_tests and not all(cors_tests):
        print(f"\n🔧 CORS Issues Detected:")
        print(f"1. Check CORS middleware configuration")
        print(f"2. Ensure your frontend origin is in allow_origins")
        print(f"3. Try setting allow_credentials=False")

if __name__ == "__main__":
    main()