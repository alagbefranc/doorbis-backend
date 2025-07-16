#!/usr/bin/env python3
"""
Script to create a test user in MongoDB for DoorBis app
"""

from pymongo import MongoClient
from passlib.context import CryptContext
import uuid
from datetime import datetime

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def create_test_user():
    """Create a test user in MongoDB"""
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    db = client['kush_door']
    
    # Test user data
    test_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@kushpro.ca",
        "hashed_password": get_password_hash("admin123"),
        "full_name": "Test Admin",
        "store_name": "Kush Door Test Store",
        "phone": "(555) 123-4567",
        "address": "123 Test Street, Test City, TC 12345",
        "license_number": "TC-12345-LIC",
        "subdomain": "test-admin",
        "is_active": True,
        "role": "admin",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Check if user already exists
    existing_user = db.users.find_one({"email": test_user["email"]})
    if existing_user:
        print(f"User {test_user['email']} already exists!")
        return
    
    # Insert the user
    result = db.users.insert_one(test_user)
    print(f"Test user created successfully!")
    print(f"User ID: {result.inserted_id}")
    print(f"Email: {test_user['email']}")
    print(f"Password: admin123")
    
    # Verify the user was created
    created_user = db.users.find_one({"email": test_user["email"]})
    if created_user:
        print("✓ User verified in database")
    else:
        print("✗ Failed to verify user in database")

if __name__ == "__main__":
    create_test_user()
