#!/usr/bin/env python3
"""
Script to create a valley-dispensary user and storefront for the frontend
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

def create_valley_dispensary():
    """Create a valley-dispensary user and storefront"""
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    db = client['kush_door']
    
    # Valley dispensary user data
    valley_user = {
        "id": "valley-dispensary",
        "email": "info@valleydispensary.com",
        "hashed_password": get_password_hash("valley123"),
        "full_name": "Valley Dispensary Owner",
        "store_name": "Valley Dispensary",
        "phone": "(555) 987-6543",
        "address": "456 Valley Road, Valley City, VC 54321",
        "license_number": "VC-54321-LIC",
        "subdomain": "valley-dispensary",
        "is_active": True,
        "role": "admin",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Check if user already exists
    existing_user = db.users.find_one({"id": "valley-dispensary"})
    if existing_user:
        print(f"User valley-dispensary already exists!")
    else:
        # Insert the user
        result = db.users.insert_one(valley_user)
        print(f"Valley dispensary user created successfully!")
        print(f"User ID: valley-dispensary")
        print(f"Email: {valley_user['email']}")
        print(f"Password: valley123")
    
    # Create storefront for valley-dispensary
    storefront_data = {
        "user_id": "valley-dispensary",
        "dispensary_name": "Valley Dispensary",
        "description": "Premium cannabis products in the heart of the valley",
        "theme_color": "#10B981",
        "contact_phone": "(555) 987-6543",
        "contact_email": "info@valleydispensary.com",
        "address": "456 Valley Road, Valley City, VC 54321",
        "hours": {
            "monday": "9AM-9PM",
            "tuesday": "9AM-9PM",
            "wednesday": "9AM-9PM",
            "thursday": "9AM-9PM",
            "friday": "9AM-10PM",
            "saturday": "10AM-10PM",
            "sunday": "10AM-8PM"
        },
        "social_media": {
            "instagram": "@valleydispensary",
            "facebook": "valleydispensary"
        },
        "features": {
            "delivery": True,
            "pickup": True,
            "online_ordering": True
        },
        "seo_title": "Valley Dispensary - Premium Cannabis Products",
        "seo_description": "Browse our premium cannabis selection with fast delivery in Valley City.",
        "custom_css": "",
        "announcement_banner": "Welcome to Valley Dispensary! Free delivery on orders over $50.",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Check if storefront already exists
    existing_storefront = db.storefronts.find_one({"user_id": "valley-dispensary"})
    if existing_storefront:
        print("Storefront for valley-dispensary already exists!")
    else:
        # Insert the storefront
        result = db.storefronts.insert_one(storefront_data)
        print("Valley dispensary storefront created successfully!")
        print(f"Storefront ID: {result.inserted_id}")
    
    # Create some sample products for valley-dispensary
    sample_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Blue Dream",
            "category": "Flower",
            "strain": "Hybrid",
            "thc_percentage": "18-24%",
            "cbd_percentage": "0.1%",
            "price": 45.00,
            "stock": 25,
            "description": "A balanced hybrid with sweet berry aroma and relaxing effects",
            "image_emoji": "🌿",
            "status": "active",
            "user_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sour Diesel",
            "category": "Flower",
            "strain": "Sativa",
            "thc_percentage": "20-25%",
            "cbd_percentage": "0.2%",
            "price": 50.00,
            "stock": 15,
            "description": "Energizing sativa with diesel aroma and uplifting effects",
            "image_emoji": "⚡",
            "status": "active",
            "user_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "OG Kush",
            "category": "Flower",
            "strain": "Indica",
            "thc_percentage": "20-25%",
            "cbd_percentage": "0.2%",
            "price": 48.00,
            "stock": 20,
            "description": "Classic indica with earthy pine flavors and relaxing effects",
            "image_emoji": "🌲",
            "status": "active",
            "user_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Gummy Bears",
            "category": "Edibles",
            "strain": "Hybrid",
            "thc_percentage": "10mg per piece",
            "cbd_percentage": "0mg",
            "price": 25.00,
            "stock": 50,
            "description": "Delicious fruit-flavored gummies with consistent dosing",
            "image_emoji": "🐻",
            "status": "active",
            "user_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Check if products already exist
    existing_products = db.products.find({"user_id": "valley-dispensary"}).count()
    if existing_products > 0:
        print(f"Products for valley-dispensary already exist ({existing_products} products)")
    else:
        # Insert sample products
        result = db.products.insert_many(sample_products)
        print(f"Created {len(sample_products)} sample products for valley-dispensary")
    
    print("\n✓ Valley dispensary setup complete!")
    print("Frontend should now be able to access: /api/storefront/public/valley-dispensary")

if __name__ == "__main__":
    create_valley_dispensary()
