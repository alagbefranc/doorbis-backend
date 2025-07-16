#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_database
from passlib.context import CryptContext
import uuid
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_isolated_test_data():
    """Create isolated test data for different storefronts"""
    db = await get_database()
    
    print("=== CREATING ISOLATED TEST DATA ===")
    
    # Ensure all test accounts have correct passwords
    print("\n1. Setting up test accounts with correct passwords:")
    
    test_accounts = [
        {
            "id": "7cc610dd-dcb9-44a2-853e-c97b6fec8b25",
            "email": "admin@kushpro.ca",
            "password": "password123",
            "subdomain": "test-admin",
            "business_name": "Kush Pro Cannabis",
            "dispensary_name": "Kush Pro"
        },
        {
            "id": "user_001", 
            "email": "owner@greenvalley.com",
            "password": "password123",
            "subdomain": "green-valley-dispensary",
            "business_name": "Green Valley Dispensary",
            "dispensary_name": "Green Valley"
        },
        {
            "id": "valley-dispensary",
            "email": "info@valleydispensary.com", 
            "password": "password123",
            "subdomain": "valley-dispensary",
            "business_name": "Valley Cannabis Co",
            "dispensary_name": "Valley Cannabis"
        }
    ]
    
    # Update passwords for all accounts
    for account in test_accounts:
        hashed_password = pwd_context.hash(account["password"])
        await db.users.update_one(
            {"id": account["id"]},
            {
                "$set": {
                    "password_hash": hashed_password,
                    "business_name": account["business_name"]
                }
            }
        )
        print(f"   ✓ Updated {account['email']} with correct password and business info")
    
    # Create isolated customers for each storefront
    print("\n2. Creating isolated customers for each storefront:")
    
    # Clear existing test customers to avoid conflicts
    await db.customer_auth.delete_many({"email": {"$regex": "@test"}})
    await db.customers.delete_many({"email": {"$regex": "@test"}})
    
    # Create customers for Kush Pro (admin@kushpro.ca)
    kush_pro_customers = [
        {
            "id": str(uuid.uuid4()),
            "name": "Alex Thompson",
            "email": "alex@test-kushpro.com",
            "phone": "555-0101",
            "password_hash": pwd_context.hash("customerpass"),
            "address": "123 Kush Street, Toronto, ON",
            "total_orders": 3,
            "total_spent": 245.50,
            "loyalty_tier": "silver",
            "status": "active",
            "store_id": "7cc610dd-dcb9-44a2-853e-c97b6fec8b25",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "email_verified": True,
            "phone_verified": False
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Maria Rodriguez",
            "email": "maria@test-kushpro.com",
            "phone": "555-0102",
            "password_hash": pwd_context.hash("customerpass"),
            "address": "456 Cannabis Ave, Toronto, ON",
            "total_orders": 1,
            "total_spent": 89.99,
            "loyalty_tier": "bronze",
            "status": "active",
            "store_id": "7cc610dd-dcb9-44a2-853e-c97b6fec8b25",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "email_verified": True,
            "phone_verified": True
        }
    ]
    
    # Create customers for Valley Cannabis (info@valleydispensary.com)
    valley_customers = [
        {
            "id": str(uuid.uuid4()),
            "name": "James Wilson",
            "email": "james@test-valley.com",
            "phone": "555-0201",
            "password_hash": pwd_context.hash("customerpass"),
            "address": "789 Valley Road, Vancouver, BC",
            "total_orders": 5,
            "total_spent": 412.75,
            "loyalty_tier": "gold",
            "status": "active",
            "store_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "email_verified": True,
            "phone_verified": True
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Lisa Chang",
            "email": "lisa@test-valley.com",
            "phone": "555-0202",
            "password_hash": pwd_context.hash("customerpass"),
            "address": "321 Mountain View, Vancouver, BC",
            "total_orders": 2,
            "total_spent": 156.25,
            "loyalty_tier": "bronze",
            "status": "active",
            "store_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "email_verified": False,
            "phone_verified": True
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Robert Kim",
            "email": "robert@test-valley.com",
            "phone": "555-0203",
            "password_hash": pwd_context.hash("customerpass"),
            "address": "654 Pacific Street, Vancouver, BC",
            "total_orders": 8,
            "total_spent": 720.30,
            "loyalty_tier": "platinum",
            "status": "active",
            "store_id": "valley-dispensary",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "email_verified": True,
            "phone_verified": True
        }
    ]
    
    # Insert customers into customer_auth collection
    if kush_pro_customers:
        await db.customer_auth.insert_many(kush_pro_customers)
        print(f"   ✓ Created {len(kush_pro_customers)} customers for Kush Pro")
    
    if valley_customers:
        await db.customer_auth.insert_many(valley_customers)
        print(f"   ✓ Created {len(valley_customers)} customers for Valley Cannabis")
    
    # Also create corresponding entries in regular customers collection
    for customer in kush_pro_customers:
        regular_customer = {
            "id": str(uuid.uuid4()),
            "name": customer["name"],
            "email": customer["email"],
            "phone": customer["phone"],
            "address": customer["address"],
            "total_orders": customer["total_orders"],
            "total_spent": customer["total_spent"],
            "average_order_value": customer["total_spent"] / max(customer["total_orders"], 1),
            "loyalty_tier": customer["loyalty_tier"],
            "status": customer["status"],
            "user_id": "7cc610dd-dcb9-44a2-853e-c97b6fec8b25",
            "source": "storefront",
            "created_at": customer["created_at"],
            "updated_at": customer["updated_at"],
            "last_order_date": None
        }
        await db.customers.insert_one(regular_customer)
    
    for customer in valley_customers:
        regular_customer = {
            "id": str(uuid.uuid4()),
            "name": customer["name"],
            "email": customer["email"],
            "phone": customer["phone"],
            "address": customer["address"],
            "total_orders": customer["total_orders"],
            "total_spent": customer["total_spent"],
            "average_order_value": customer["total_spent"] / max(customer["total_orders"], 1),
            "loyalty_tier": customer["loyalty_tier"],
            "status": customer["status"],
            "user_id": "valley-dispensary",
            "source": "storefront",
            "created_at": customer["created_at"],
            "updated_at": customer["updated_at"],
            "last_order_date": None
        }
        await db.customers.insert_one(regular_customer)
    
    print("\n3. Final verification - Each storefront now has isolated data:")
    
    # Verify isolation
    for account in test_accounts:
        user_id = account["id"]
        email = account["email"]
        
        # Count customers for this user
        storefront_customers = await db.customer_auth.count_documents({"store_id": user_id})
        regular_customers = await db.customers.count_documents({"user_id": user_id})
        products = await db.products.count_documents({"user_id": user_id})
        
        print(f"   {account['dispensary_name']} ({email}):")
        print(f"     - Storefront customers: {storefront_customers}")
        print(f"     - Regular customers: {regular_customers}")
        print(f"     - Products: {products}")
    
    print(f"\n=== SETUP COMPLETE ===")
    
    # Instructions
    print(f"\n=== TESTING INSTRUCTIONS ===")
    print("Now you can test storefront isolation:")
    print("1. Clear your browser cache and localStorage")
    print("2. Go to the login page")
    print("3. Try logging in with different accounts:")
    print("   - admin@kushpro.ca / password123 (should see Kush Pro data)")
    print("   - owner@greenvalley.com / password123 (should see Green Valley data)")
    print("   - info@valleydispensary.com / password123 (should see Valley Cannabis data)")
    print("4. Each account should show ONLY their own customers, products, and orders")
    print("5. Customers page should show different customers for each storefront")

if __name__ == "__main__":
    asyncio.run(create_isolated_test_data())
