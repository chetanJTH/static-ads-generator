#!/usr/bin/env python3
"""
Test script for the remove-bg API endpoint
"""
import requests
import base64
from PIL import Image
import io

def test_remove_bg_with_file(file_path: str, api_url: str = "http://localhost:8000/remove-bg/"):
    """Test the remove-bg endpoint with a file"""
    try:
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(api_url, files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Success! Background removed.")
            print(f"Response size: {len(result['png_base64'])} characters")
            
            # Save the result as a PNG file
            png_data = base64.b64decode(result['png_base64'])
            with open('output_no_bg.png', 'wb') as f:
                f.write(png_data)
            print("💾 Saved result as 'output_no_bg.png'")
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

def test_remove_bg_with_pil_image():
    """Test with a generated PIL image"""
    try:
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='red')
        
        # Convert to bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        # Send request
        files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
        response = requests.post("http://localhost:8000/remove-bg/", files=files)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Success with generated image!")
            print(f"Response size: {len(result['png_base64'])} characters")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    print("🧪 Testing Remove Background API")
    print("=" * 40)
    
    # Test with generated image
    print("1. Testing with generated image...")
    test_remove_bg_with_pil_image()
    
    print("\n2. To test with your own image, run:")
    print("   python test_remove_bg.py your_image.jpg")
    
    # If a file path is provided as argument
    import sys
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        print(f"\n3. Testing with file: {file_path}")
        test_remove_bg_with_file(file_path)
