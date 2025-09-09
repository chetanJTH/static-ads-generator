#!/usr/bin/env python3
"""
Test script for production CORS issues
"""
import requests
import json

def test_cors_headers():
    """Test CORS headers on production API"""
    url = "https://staticapi.kraftey.com"
    
    print("🧪 Testing CORS Configuration on Production")
    print("=" * 50)
    
    # Test 1: Simple GET request
    print("1. Testing simple GET request...")
    try:
        response = requests.get(f"{url}/health", timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   CORS Headers:")
        for header in response.headers:
            if 'access-control' in header.lower():
                print(f"     {header}: {response.headers[header]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: OPTIONS preflight request
    print("\n2. Testing OPTIONS preflight request...")
    try:
        headers = {
            'Origin': 'https://kraftey.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{url}/remove-bg/", headers=headers, timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   CORS Headers:")
        for header in response.headers:
            if 'access-control' in header.lower():
                print(f"     {header}: {response.headers[header]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: POST request with CORS headers
    print("\n3. Testing POST request with CORS headers...")
    try:
        headers = {
            'Origin': 'https://kraftey.com',
            'Content-Type': 'application/json'
        }
        response = requests.post(f"{url}/remove-bg/", 
                               headers=headers, 
                               json={"test": "data"}, 
                               timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   CORS Headers:")
        for header in response.headers:
            if 'access-control' in header.lower():
                print(f"     {header}: {response.headers[header]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def test_with_curl_commands():
    """Generate correct curl commands for testing"""
    print("\n🔧 Correct Curl Commands for Testing:")
    print("=" * 50)
    
    print("1. Test health endpoint:")
    print("curl -v https://staticapi.kraftey.com/health")
    
    print("\n2. Test OPTIONS preflight:")
    print("""curl -v -X OPTIONS https://staticapi.kraftey.com/remove-bg/ \\
  -H 'Origin: https://kraftey.com' \\
  -H 'Access-Control-Request-Method: POST' \\
  -H 'Access-Control-Request-Headers: Content-Type'""")
    
    print("\n3. Test POST with real image file:")
    print("""curl -v -X POST https://staticapi.kraftey.com/remove-bg/ \\
  -H 'Origin: https://kraftey.com' \\
  -H 'Accept: application/json' \\
  -F 'file=@your_image.jpg'""")
    
    print("\n4. Test with all browser headers:")
    print("""curl -v -X POST https://staticapi.kraftey.com/remove-bg/ \\
  -H 'Origin: https://kraftey.com' \\
  -H 'Referer: https://kraftey.com/' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \\
  -H 'DNT: 1' \\
  -H 'sec-ch-ua: "Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"' \\
  -H 'sec-ch-ua-mobile: ?0' \\
  -H 'sec-ch-ua-platform: "Windows"' \\
  -F 'file=@your_image.jpg'""")

if __name__ == "__main__":
    test_cors_headers()
    test_with_curl_commands()
