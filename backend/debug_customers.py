#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_database

async def debug_customers():
    """Debug customer database issues"""
    db = await get_database()
    
    print("=== DEBUGGING CUSTOMER ISSUE ===")
    
    # Check customer_auth collection
    print("\n1. Checking customer_auth collection:")
    customer_auth_count = await db.customer_auth.count_documents({})
    print(f"   Total customer_auth records: {customer_auth_count}")
    
    if customer_auth_count > 0:
        print("\n   Sample customer_auth records:")
        sample_customers = await db.customer_auth.find({}).limit(3).to_list(3)
        for i, customer in enumerate(sample_customers, 1):
            print(f"   Customer {i}:")
            print(f"     - ID: {customer.get('id')}")
            print(f"     - Name: {customer.get('name')}")
            print(f"     - Email: {customer.get('email')}")
            print(f"     - Store ID: {customer.get('store_id')}")
            print(f"     - Status: {customer.get('status')}")
            print(f"     - Total Orders: {customer.get('total_orders', 0)}")
            print(f"     - Total Spent: {customer.get('total_spent', 0.0)}")
    
    # Check users collection to see store owners
    print("\n2. Checking users collection:")
    users_count = await db.users.count_documents({})
    print(f"   Total users: {users_count}")
    
    if users_count > 0:
        print("\n   Sample users (store owners):")
        sample_users = await db.users.find({}).limit(3).to_list(3)
        for i, user in enumerate(sample_users, 1):
            print(f"   User {i}:")
            print(f"     - ID: {user.get('id')}")
            print(f"     - Email: {user.get('email')}")
            print(f"     - Subdomain: {user.get('subdomain')}")
            print(f"     - Business Name: {user.get('business_name')}")
    
    # Check the relationship between customers and store owners
    print("\n3. Checking customer-store relationships:")
    if customer_auth_count > 0 and users_count > 0:
        # Get a user to check their customers
        first_user = await db.users.find_one({})
        if first_user:
            user_id = first_user.get('id')
            print(f"   Checking customers for user ID: {user_id}")
            
            # Count customers for this user (store owner)
            customers_for_user = await db.customer_auth.find({"store_id": user_id}).to_list(1000)
            print(f"   Found {len(customers_for_user)} customers for this store owner")
            
            if customers_for_user:
                print("\n   Customer details for this store:")
                for customer in customers_for_user:
                    print(f"     - {customer.get('name')} ({customer.get('email')})")
    
    # Check the regular customers collection
    print("\n4. Checking regular customers collection:")
    customers_count = await db.customers.count_documents({})
    print(f"   Total customers records: {customers_count}")
    
    if customers_count > 0:
        print("\n   Sample customers records:")
        sample_regular_customers = await db.customers.find({}).limit(3).to_list(3)
        for i, customer in enumerate(sample_regular_customers, 1):
            print(f"   Customer {i}:")
            print(f"     - ID: {customer.get('id')}")
            print(f"     - Name: {customer.get('name')}")
            print(f"     - Email: {customer.get('email')}")
            print(f"     - User ID: {customer.get('user_id')}")
            print(f"     - Source: {customer.get('source')}")
    
    print("\n=== DEBUG COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(debug_customers())
