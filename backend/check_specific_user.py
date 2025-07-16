#!/usr/bin/env python3
"""
Script to check a specific user's data and storefront configuration
"""
import asyncio
import json
import sys
from database import get_database

async def check_specific_user(email_or_subdomain):
    """Check detailed information for a specific user"""
    db = await get_database()
    
    # Try to find user by email or subdomain
    user = await db.users.find_one({"$or": [
        {"email": email_or_subdomain},
        {"subdomain": email_or_subdomain}
    ]})
    
    if not user:
        print(f"User with email or subdomain '{email_or_subdomain}' not found")
        return
    
    print(f"User found: {user.get('email')}")
    print(f"User ID: {user.get('id')}")
    print(f"Subdomain: {user.get('subdomain', 'No subdomain')}")
    
    # Check if storefront exists
    storefront = await db.storefronts.find_one({"user_id": user.get('id')})
    if storefront:
        print("\nStorefront found:")
        print(f"Dispensary name: {storefront.get('dispensary_name')}")
        print(f"Is active: {storefront.get('is_active', False)}")
        
        # Print full storefront details
        print("\nFull storefront details:")
        # Remove MongoDB ObjectId which is not JSON serializable
        storefront_copy = dict(storefront)
        if '_id' in storefront_copy:
            del storefront_copy['_id']
        print(json.dumps(storefront_copy, indent=2))
    else:
        print("\nNo storefront found for this user")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_specific_user.py <email_or_subdomain>")
        sys.exit(1)
        
    email_or_subdomain = sys.argv[1]
    asyncio.run(check_specific_user(email_or_subdomain))
