#!/usr/bin/env python3
"""
Script to create default storefront configuration for users who don't have one
"""
import asyncio
import sys
from database import get_database
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_default_storefronts():
    """Create default storefront for users who have products but no storefront"""
    try:
        db = await get_database()
        
        # Get all unique user_ids from products
        pipeline = [
            {"$group": {"_id": "$user_id", "product_count": {"$sum": 1}}}
        ]
        users_with_products = await db.products.aggregate(pipeline).to_list(None)
        
        logger.info(f"Found {len(users_with_products)} users with products")
        
        for user_data in users_with_products:
            user_id = user_data["_id"]
            product_count = user_data["product_count"]
            
            # Check if storefront already exists
            existing_storefront = await db.storefronts.find_one({"user_id": user_id})
            
            if existing_storefront:
                logger.info(f"User {user_id} already has storefront: {existing_storefront.get('dispensary_name', 'unnamed')}")
                continue
            
            # Create default storefront
            default_storefront = {
                "user_id": user_id,
                "dispensary_name": "Cannabis Dispensary",
                "description": "Premium cannabis products with fast delivery",
                "theme_color": "#10B981",
                "contact_phone": None,
                "contact_email": None,
                "address": None,
                "hours": {
                    "monday": "9AM-8PM",
                    "tuesday": "9AM-8PM", 
                    "wednesday": "9AM-8PM",
                    "thursday": "9AM-8PM",
                    "friday": "9AM-8PM",
                    "saturday": "10AM-6PM",
                    "sunday": "10AM-6PM"
                },
                "social_media": {},
                "features": {
                    "delivery": True,
                    "pickup": True,
                    "online_ordering": True
                },
                "seo_title": "Cannabis Dispensary - Premium Cannabis Products",
                "seo_description": "Browse our premium cannabis selection with delivery and pickup options.",
                "custom_css": "",
                "announcement_banner": "",
                "is_active": True
            }
            
            # Insert the storefront
            result = await db.storefronts.insert_one(default_storefront)
            logger.info(f"✓ Created default storefront for user {user_id} (has {product_count} products)")
            logger.info(f"  Storefront ID: {result.inserted_id}")
        
        logger.info("\n✓ Default storefront creation complete!")
        
    except Exception as e:
        logger.error(f"Error creating storefronts: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(create_default_storefronts())
