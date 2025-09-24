#!/usr/bin/env python3
"""
Test Authentication Endpoint Script
This script tests the authentication endpoint directly to debug 401 errors.
"""

import requests
import json
import sys

def test_auth_endpoint():
    """Test the authentication endpoint with the provided credentials"""
    print("🔍 Testing authentication endpoint...")
    
    # Test data from the curl command
    url = "https://kraftey.com/api/auth/callback/credentials"
    
    headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'DNT': '1',
        'Origin': 'https://kraftey.com',
        'Referer': 'https://kraftey.com/auth/signin?callbackUrl=https%3A%2F%2Fkraftey.com%2Fadmin%2Fblog',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
    }
    
    data = {
        'email': 'info.kraftey@gmail.com',
        'password': 'admin123',
        'redirect': 'false',
        'json': 'true'
    }
    
    try:
        print(f"📡 Making request to: {url}")
        print(f"📧 Email: {data['email']}")
        print(f"🔑 Password: {data['password']}")
        
        response = requests.post(url, headers=headers, data=data, timeout=30)
        
        print(f"\n📊 Response Status: {response.status_code}")
        print(f"📋 Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        print(f"\n📄 Response Body:")
        try:
            response_json = response.json()
            print(json.dumps(response_json, indent=2))
        except:
            print(response.text)
        
        if response.status_code == 200:
            print("\n✅ Authentication successful!")
        elif response.status_code == 401:
            print("\n❌ Authentication failed (401 Unauthorized)")
            print("Possible causes:")
            print("1. User doesn't exist in database")
            print("2. Password is incorrect")
            print("3. Database connection issues")
            print("4. Environment variables missing")
        else:
            print(f"\n⚠️  Unexpected status code: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_health_endpoints():
    """Test various health endpoints to check server status"""
    print("\n🔍 Testing health endpoints...")
    
    endpoints = [
        "https://kraftey.com/api/auth/providers",
        "https://kraftey.com/api/auth/session",
        "https://staticapi.kraftey.com/health/",
        "https://staticapi.kraftey.com/blog/posts"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"\n📡 Testing: {endpoint}")
            response = requests.get(endpoint, timeout=10)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print("   ✅ OK")
            else:
                print(f"   ❌ Error: {response.text[:100]}...")
                
        except Exception as e:
            print(f"   ❌ Failed: {e}")

def main():
    print("🚀 Authentication Endpoint Test Script")
    print("=" * 50)
    
    test_auth_endpoint()
    test_health_endpoints()
    
    print("\n" + "=" * 50)
    print("📋 Next Steps:")
    print("1. Run debug_production_auth.py on the server")
    print("2. Check environment variables")
    print("3. Verify database connection")
    print("4. Create admin user if needed")

if __name__ == "__main__":
    main()
