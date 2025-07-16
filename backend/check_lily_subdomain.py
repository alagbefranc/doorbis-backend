import asyncio
import re
from database import get_database

async def check_lily_subdomain():
    db = await get_database()
    
    # Check variations with exact case matching
    variations = ['lily', 'LILY', 'Lily', 'LILI', 'Lili', 'lili']
    
    print("\nChecking exact case matches for subdomain variations:")
    for variation in variations:
        user = await db.users.find_one({"subdomain": variation})
        if user:
            print(f"✅ Found user with subdomain '{variation}':")
            print(f"  - Email: {user.get('email')}")
            print(f"  - User ID: {user.get('id')}")
            
            # Check if this user has an active storefront
            storefront = await db.storefronts.find_one({"user_id": user["id"], "is_active": True})
            if storefront:
                print(f"  - ✅ User has an ACTIVE storefront: {storefront.get('dispensary_name')}")
            else:
                print(f"  - ❌ User does NOT have an active storefront")
                
                # Check if they have any storefront at all
                any_storefront = await db.storefronts.find_one({"user_id": user["id"]})
                if any_storefront:
                    print(f"  - Found inactive storefront: {any_storefront.get('dispensary_name')}")
                    print(f"  - is_active flag: {any_storefront.get('is_active')}")
                else:
                    print("  - No storefront record found at all")
        else:
            print(f"❌ No user found with exact subdomain '{variation}'")
    
    # Test the exact regex pattern used in the API endpoint
    print("\nTesting regex case-insensitive pattern (like API endpoint):")
    test_variations = ['LILY', 'lily', 'LILI', 'lili']
    for test in test_variations:
        user = await db.users.find_one({"subdomain": re.compile(f"^{re.escape(test)}$", re.IGNORECASE)})
        if user:
            print(f"✅ Regex found user for '{test}': {user.get('email')} with subdomain='{user.get('subdomain')}'")    
        else:
            print(f"❌ Regex found NO user for '{test}'")
    
    # List all users with subdomains for reference
    print("\nAll users with subdomains in the database:")
    users_with_subdomains = await db.users.find({"subdomain": {"$exists": True}}).to_list(100)
    for u in users_with_subdomains:
        print(f"  - {u.get('email')}: subdomain='{u.get('subdomain')}'")

# Run the async function
if __name__ == "__main__":
    asyncio.run(check_lily_subdomain())
