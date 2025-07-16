#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_database

async def fix_customers():
    """Fix customer database issues"""
    db = await get_database()
    
    print("=== FIXING CUSTOMER ISSUE ===")
    
    # First, let's check which user is the main admin/owner
    print("\n1. Checking users and their relationships:")
    users = await db.users.find({}).to_list(100)
    for user in users:
        print(f"User: {user.get('email')} (ID: {user.get('id')})")
        print(f"  Subdomain: {user.get('subdomain')}")
        
        # Count customers for this user in customer_auth
        customer_auth_count = await db.customer_auth.count_documents({"store_id": user.get('id')})
        print(f"  Customer_auth records: {customer_auth_count}")
        
        # Count customers for this user in customers collection
        customers_count = await db.customers.count_documents({"user_id": user.get('id')})
        print(f"  Regular customers records: {customers_count}")
        print()
    
    # Let's check if we need to migrate customer_auth records to be visible
    print("\n2. Checking if we need to sync customer data:")
    
    # Get the main user (seems like user_001 has most data)
    main_user = await db.users.find_one({"id": "user_001"})
    if not main_user:
        # Fallback to first user with customers
        customers_in_customers = await db.customers.find_one({})
        if customers_in_customers:
            main_user_id = customers_in_customers.get('user_id')
            main_user = await db.users.find_one({"id": main_user_id})
    
    if main_user:
        main_user_id = main_user.get('id')
        print(f"Using main user: {main_user.get('email')} (ID: {main_user_id})")
        
        # Check customers in customer_auth for this user
        storefront_customers = await db.customer_auth.find({"store_id": main_user_id}).to_list(1000)
        print(f"Found {len(storefront_customers)} storefront customers")
        
        # Check customers in regular customers collection
        regular_customers = await db.customers.find({"user_id": main_user_id}).to_list(1000)
        print(f"Found {len(regular_customers)} regular customers")
        
        # Let's make sure both collections have the right data
        print("\n3. Ensuring customers are properly linked:")
        
        # For each regular customer, ensure they exist in customer_auth too (if they came from storefront)
        for customer in regular_customers:
            if customer.get('source') == 'storefront':
                # Check if exists in customer_auth
                exists_in_auth = await db.customer_auth.find_one({
                    "email": customer.get('email'),
                    "store_id": main_user_id
                })
                
                if not exists_in_auth:
                    print(f"  Adding {customer.get('name')} to customer_auth")
                    # Create a customer_auth record
                    import uuid
                    from datetime import datetime
                    
                    new_customer_auth = {
                        "id": str(uuid.uuid4()),
                        "name": customer.get('name'),
                        "email": customer.get('email'),
                        "phone": customer.get('phone', ''),
                        "password_hash": "placeholder_hash",  # They'll need to reset
                        "address": customer.get('address', ''),
                        "date_of_birth": None,
                        "total_orders": customer.get('total_orders', 0),
                        "total_spent": customer.get('total_spent', 0.0),
                        "average_order_value": customer.get('average_order_value', 0.0),
                        "loyalty_tier": customer.get('loyalty_tier', 'bronze'),
                        "status": customer.get('status', 'active'),
                        "store_id": main_user_id,
                        "created_at": customer.get('created_at', datetime.utcnow()),
                        "updated_at": datetime.utcnow(),
                        "last_order_date": customer.get('last_order_date'),
                        "email_verified": False,
                        "phone_verified": False
                    }
                    
                    await db.customer_auth.insert_one(new_customer_auth)
        
        # Also sync customer_auth data to regular customers if missing
        for customer in storefront_customers:
            exists_in_customers = await db.customers.find_one({
                "email": customer.get('email'),
                "user_id": main_user_id
            })
            
            if not exists_in_customers:
                print(f"  Adding {customer.get('name')} to regular customers")
                import uuid
                from datetime import datetime
                
                new_customer = {
                    "id": str(uuid.uuid4()),
                    "name": customer.get('name'),
                    "email": customer.get('email'),
                    "phone": customer.get('phone', ''),
                    "address": customer.get('address', ''),
                    "total_orders": customer.get('total_orders', 0),
                    "total_spent": customer.get('total_spent', 0.0),
                    "average_order_value": customer.get('average_order_value', 0.0),
                    "loyalty_tier": customer.get('loyalty_tier', 'bronze'),
                    "status": customer.get('status', 'active'),
                    "user_id": main_user_id,
                    "source": "storefront",
                    "created_at": customer.get('created_at', datetime.utcnow()),
                    "updated_at": datetime.utcnow(),
                    "last_order_date": customer.get('last_order_date')
                }
                
                await db.customers.insert_one(new_customer)
    
    print("\n4. Final verification:")
    # Check final counts
    for user in users:
        user_id = user.get('id')
        customer_auth_count = await db.customer_auth.count_documents({"store_id": user_id})
        customers_count = await db.customers.count_documents({"user_id": user_id})
        print(f"User {user.get('email')}: {customer_auth_count} auth customers, {customers_count} regular customers")
    
    print("\n=== FIX COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(fix_customers())
