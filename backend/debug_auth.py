#!/usr/bin/env python3
"""
Debug script to test password authentication
"""

from pymongo import MongoClient
from passlib.context import CryptContext

# Password hashing setup (same as in auth.py)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def test_authentication():
    """Test the authentication process"""
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    db = client['kush_door']
    
    # Test credentials
    test_email = "admin@kushpro.ca"
    test_password = "admin123"
    
    print(f"Testing authentication for: {test_email}")
    
    # Get user from database
    user = db.users.find_one({"email": test_email})
    if not user:
        print("❌ User not found in database")
        return False
    
    print("✅ User found in database")
    print(f"User email: {user.get('email')}")
    print(f"User active: {user.get('is_active')}")
    print(f"Hashed password length: {len(user.get('hashed_password', ''))}")
    
    # Test password verification
    hashed_password = user.get('hashed_password')
    if not hashed_password:
        print("❌ No hashed password found")
        return False
    
    print(f"Testing password verification...")
    try:
        is_valid = verify_password(test_password, hashed_password)
        if is_valid:
            print("✅ Password verification successful!")
            return True
        else:
            print("❌ Password verification failed!")
            return False
    except Exception as e:
        print(f"❌ Error during password verification: {e}")
        return False

if __name__ == "__main__":
    test_authentication()
