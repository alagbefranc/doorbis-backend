#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_database

async def debug_storefront_isolation():
    """Debug storefront isolation issues"""
    db = await get_database()
    
    print("=== DEBUGGING STOREFRONT ISOLATION ===")
    
    # Check all users and their associated data
    print("\n1. Checking all users and their isolated data:")
    users = await db.users.find({}).to_list(100)
    
    for user in users:
        user_id = user.get('id')
        user_email = user.get('email')
        subdomain = user.get('subdomain')
        
        print(f"\n--- User: {user_email} (ID: {user_id}) ---")
        print(f"   Subdomain: {subdomain}")
        
        # Check customers in customer_auth (storefront customers)
        storefront_customers = await db.customer_auth.find({"store_id": user_id}).to_list(1000)
        print(f"   Storefront customers: {len(storefront_customers)}")
        for customer in storefront_customers:
            print(f"     - {customer.get('name')} ({customer.get('email')})")
        
        # Check customers in regular customers collection
        regular_customers = await db.customers.find({"user_id": user_id}).to_list(1000)
        print(f"   Regular customers: {len(regular_customers)}")
        for customer in regular_customers:
            print(f"     - {customer.get('name')} ({customer.get('email')})")
        
        # Check products for this user
        products = await db.products.find({"user_id": user_id}).to_list(1000)
        print(f"   Products: {len(products)}")
        
        # Check orders for this user
        orders = await db.orders.find({"user_id": user_id}).to_list(1000)
        print(f"   Orders: {len(orders)}")
        
        # Check storefront config
        storefront_config = await db.storefront_configs.find_one({"user_id": user_id})
        if storefront_config:
            print(f"   Storefront config: {storefront_config.get('dispensary_name', 'No name')}")
        else:
            print(f"   Storefront config: None")
    
    # Check authentication tokens and current sessions
    print(f"\n2. Checking potential authentication issues:")
    
    # Look for any JWT tokens or session data that might be cached
    print("   - Each user should have isolated data based on their user_id")
    print("   - The frontend should be authenticating with the correct user credentials")
    print("   - API calls should be filtered by current_user['id']")
    
    # Check if there are any shared resources that shouldn't be shared
    print(f"\n3. Checking for data leakage:")
    
    # Check if any collections have missing user_id/store_id fields
    all_customers = await db.customers.find({}).to_list(1000)
    customers_without_user_id = [c for c in all_customers if not c.get('user_id')]
    if customers_without_user_id:
        print(f"   ⚠️  Found {len(customers_without_user_id)} customers without user_id!")
        for customer in customers_without_user_id[:3]:
            print(f"     - {customer.get('name')} ({customer.get('email')})")
    
    all_storefront_customers = await db.customer_auth.find({}).to_list(1000)
    storefront_customers_without_store_id = [c for c in all_storefront_customers if not c.get('store_id')]
    if storefront_customers_without_store_id:
        print(f"   ⚠️  Found {len(storefront_customers_without_store_id)} storefront customers without store_id!")
        for customer in storefront_customers_without_store_id[:3]:
            print(f"     - {customer.get('name')} ({customer.get('email')})")
    
    all_products = await db.products.find({}).to_list(1000)
    products_without_user_id = [p for p in all_products if not p.get('user_id')]
    if products_without_user_id:
        print(f"   ⚠️  Found {len(products_without_user_id)} products without user_id!")
        for product in products_without_user_id[:3]:
            print(f"     - {product.get('name')}")
    
    print(f"\n=== DEBUG COMPLETE ===")
    
    # Recommendations
    print(f"\n=== RECOMMENDATIONS ===")
    print("1. Each user should only see their own data:")
    print("   - Customers should be filtered by user_id/store_id")
    print("   - Products should be filtered by user_id")
    print("   - Orders should be filtered by user_id")
    print("   - Storefront configs should be filtered by user_id")
    print("\n2. Frontend authentication should be checked:")
    print("   - Make sure each user logs in with their own credentials")
    print("   - Check that JWT tokens are user-specific")
    print("   - Verify that the current_user in API calls is correct")
    print("\n3. Database queries should include proper filters:")
    print("   - All customer queries should filter by store_id/user_id")
    print("   - All product/order queries should filter by user_id")

if __name__ == "__main__":
    asyncio.run(debug_storefront_isolation())
