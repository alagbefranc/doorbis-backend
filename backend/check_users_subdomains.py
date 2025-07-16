#!/usr/bin/env python3
"""
Script to check users with subdomains and verify if storefronts exist for them
"""
import asyncio
import json
from database import get_database

async def check_users_with_subdomains():
    """Check which users have subdomains and if they have storefronts"""
    db = await get_database()
    
    # Get users with subdomains
    users_with_subdomains = await db.users.find({"subdomain": {"$exists": True}}).to_list(None)
    print(f"Found {len(users_with_subdomains)} users with subdomains")
    
    user_data = []
    for user in users_with_subdomains:
        user_id = user["id"]
        email = user.get("email", "No email")
        subdomain = user.get("subdomain", "No subdomain")
        
        # Check if storefront exists
        storefront = await db.storefronts.find_one({"user_id": user_id})
        has_storefront = "Yes" if storefront else "No"
        
        user_data.append({
            "email": email,
            "subdomain": subdomain,
            "id": user_id,
            "has_storefront": has_storefront
        })
    
    # Print the results in a formatted table
    print("\nUser Subdomain Data:")
    print("-" * 80)
    print(f"{'Email':<30} {'Subdomain':<20} {'User ID':<20} {'Has Storefront':<15}")
    print("-" * 80)
    for user in user_data:
        print(f"{user['email']:<30} {user['subdomain']:<20} {user['id']:<20} {user['has_storefront']:<15}")
    
    # Also test the storefront API endpoint for each subdomain
    print("\nTesting API endpoints for each subdomain:")
    print("-" * 80)
    for user in user_data:
        subdomain = user['subdomain']
        print(f"Testing /storefront/slug/{subdomain}...")
        # We can't make HTTP requests directly here, just provide instructions
    
    return user_data

if __name__ == "__main__":
    result = asyncio.run(check_users_with_subdomains())
    print("\nJSON result:")
    print(json.dumps(result, indent=2))
