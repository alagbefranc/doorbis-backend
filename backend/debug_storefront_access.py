#!/usr/bin/env python3
"""
Script to debug storefront access by subdomain
This script simulates the logic used in the /storefront/slug/{slug} endpoint
to help identify why subdomain lookups are failing
"""
import asyncio
import json
import sys
from database import get_database
from bson import json_util

# Parse MongoDB objects to JSON
def parse_json(data):
    return json.loads(json_util.dumps(data))

async def debug_storefront_access_by_subdomain(subdomain):
    """Debug the storefront access by subdomain logic"""
    print(f"\n=== Debugging storefront access for subdomain: {subdomain} ===\n")
    
    try:
        db = await get_database()
        print("✅ Database connection successful")
        
        # Step 1: Find the user by subdomain - exactly as the endpoint does
        print(f"\nStep 1: Looking up user by subdomain: {subdomain}")
        user = await db.users.find_one({"subdomain": subdomain})
        
        if not user:
            print("❌ User not found with this subdomain")
            
            # Additional check: Look for similar subdomains (case insensitive)
            print("\nChecking for similar subdomains (case insensitive)...")
            import re
            similar_users = await db.users.find({"subdomain": re.compile(subdomain, re.IGNORECASE)}).to_list(None)
            
            if similar_users:
                print(f"Found {len(similar_users)} similar user(s):")
                for u in similar_users:
                    print(f"  - Email: {u.get('email')}, Subdomain: {u.get('subdomain')}")
            else:
                print("No similar subdomains found")
                
            # List all users with subdomains for reference
            users_with_subdomains = await db.users.find({"subdomain": {"$exists": True}}).to_list(None)
            print(f"\nAll users with subdomains ({len(users_with_subdomains)}):")
            for u in users_with_subdomains:
                print(f"  - Email: {u.get('email')}, Subdomain: {u.get('subdomain')}")
            
            return
        
        print(f"✅ User found: {user.get('email')}")
        user_id = user.get('id')
        print(f"User ID: {user_id}")
        
        # Step 2: Get storefront config - exactly as the endpoint does
        print(f"\nStep 2: Looking up storefront by user_id and is_active=True")
        config = await db.storefronts.find_one({"user_id": user_id, "is_active": True})
        
        if not config:
            print("❌ Active storefront not found for this user")
            
            # Check if there's any storefront for this user (active or not)
            any_storefront = await db.storefronts.find_one({"user_id": user_id})
            if any_storefront:
                print(f"Note: Found an inactive storefront for this user (is_active: {any_storefront.get('is_active', False)})")
                
            return
        
        print(f"✅ Storefront found: {config.get('dispensary_name')}")
        print(f"Is active: {config.get('is_active', False)}")
        
        # Step 3: Get products
        print(f"\nStep 3: Looking up active products for this user")
        products = await db.products.find({
            "user_id": user_id, 
            "status": "active"
        }).to_list(None)
        
        print(f"Found {len(products)} active products")
        
        # Success - this is what the endpoint would return
        print("\n✅ SUCCESS! The /storefront/slug/{subdomain} endpoint should work for this subdomain")
        
        # Return all the data we found for reference
        return {
            "user": parse_json(user),
            "storefront": parse_json(config),
            "product_count": len(products)
        }
    
    except Exception as e:
        print(f"❌ Error during debugging: {str(e)}")
        raise

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python debug_storefront_access.py <subdomain>")
        sys.exit(1)
        
    subdomain = sys.argv[1]
    result = asyncio.run(debug_storefront_access_by_subdomain(subdomain))
    
    if result:
        print("\nDetailed data (JSON):")
        print(json.dumps(result, indent=2))
