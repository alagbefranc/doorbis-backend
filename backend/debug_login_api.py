#!/usr/bin/env python3
"""
Debug script to test login API endpoint directly
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import get_database
from auth.auth import authenticate_user

async def test_login_api():
    """Test the login API functionality"""
    # Test credentials
    test_email = "admin@kushpro.ca"
    test_password = "admin123"
    
    print(f"Testing login API for: {test_email}")
    
    try:
        # Get database
        db = await get_database()
        print("✅ Database connection successful")
        
        # Test authentication
        user = await authenticate_user(db, test_email, test_password)
        
        if user:
            print("✅ Authentication successful!")
            print(f"User ID: {user.get('_id')}")
            print(f"User email: {user.get('email')}")
            print(f"User active: {user.get('is_active')}")
            return True
        else:
            print("❌ Authentication failed!")
            
            # Check if user exists
            user_exists = await db.users.find_one({"email": test_email})
            if user_exists:
                print("✅ User exists in database")
                print(f"Stored password hash: {user_exists.get('hashed_password')[:20]}...")
            else:
                print("❌ User does not exist in database")
            
            return False
            
    except Exception as e:
        print(f"❌ Error during API test: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(test_login_api())
