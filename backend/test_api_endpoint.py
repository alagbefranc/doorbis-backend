#!/usr/bin/env python3
"""
Script to directly test the API endpoint logic for storefront access by subdomain
"""
import asyncio
import json
from database import get_database
from fastapi import HTTPException

async def test_storefront_by_slug_endpoint(slug):
    """
    Directly test the get_storefront_by_slug endpoint logic
    This is copied from the actual endpoint implementation
    """
    print(f"Testing /storefront/slug/{slug} endpoint logic directly")
    print("-" * 50)
    
    try:
        db = await get_database()
        
        print(f"Step 1: Finding user with subdomain '{slug}'")
        # First, find the user by subdomain
        user = await db.users.find_one({"subdomain": slug})
        if not user:
            print(f"ERROR: User not found with subdomain '{slug}'")
            raise HTTPException(status_code=404, detail="Store not found")
        
        print(f"User found: {user.get('email')} (ID: {user.get('id')})")
        user_id = user["id"]
        
        print(f"\nStep 2: Finding active storefront for user_id '{user_id}'")
        # Get storefront config
        config = await db.storefronts.find_one({"user_id": user_id, "is_active": True})
        
        if not config:
            print(f"ERROR: No active storefront found for user_id '{user_id}'")
            raise HTTPException(status_code=404, detail="Storefront not found")
        
        print(f"Storefront found: {config.get('dispensary_name')}")
        
        # Get products for this user (show only active products)
        products = await db.products.find({
            "user_id": user_id, 
            "status": "active"
        }).to_list(None)
        
        print(f"\nStep 3: Found {len(products)} active products for this user")
        
        # Remove sensitive data
        config_clean = dict(config)
        config_clean.pop('_id', None) 
        config_clean.pop('user_id', None)
        
        # Format products for public view
        public_products = []
        for product in products:
            public_products.append({
                "id": str(product["_id"]),
                "name": product["name"],
                "category": product["category"],
                "strain": product.get("strain"),
                "thc_percentage": product.get("thc_percentage"),
                "cbd_percentage": product.get("cbd_percentage"),
                "price": product["price"],
                "description": product.get("description"),
                "image_emoji": product.get("image_emoji", "🌿"),
                "stock": product["stock"],
                "in_stock": product["stock"] > 0
            })
        
        result = {
            "storefront": config_clean,
            "products": public_products
        }
        
        print("\nSUCCESS: The endpoint would return successfully for this subdomain")
        return result
        
    except HTTPException as e:
        print(f"Endpoint would return HTTP {e.status_code}: {e.detail}")
        return {"error": e.detail, "status_code": e.status_code}
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return {"error": "Internal server error", "status_code": 500}

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python test_api_endpoint.py <subdomain>")
        sys.exit(1)
    
    subdomain = sys.argv[1]
    result = asyncio.run(test_storefront_by_slug_endpoint(subdomain))
    
    print("\nEndpoint Result:")
    print(json.dumps(result, default=str, indent=2))
