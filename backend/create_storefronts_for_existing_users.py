#!/usr/bin/env python3
"""
One-time migration script to create storefronts for all existing users
"""
import asyncio
import sys
import logging
from database import get_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_storefronts_for_existing_users():
    """Create storefronts for all existing users who don't have one"""
    try:
        db = await get_database()
        
        # Get all users
        users = await db.users.find({}).to_list(None)
        
        logger.info(f"Found {len(users)} total users")
        created_count = 0
        skipped_count = 0
        
        for user in users:
            user_id = user["id"]
            
            # Check if storefront already exists
            existing_storefront = await db.storefronts.find_one({"user_id": user_id})
            
            if existing_storefront:
                logger.info(f"- Skipping user {user_id} ({user.get('email')}): storefront already exists")
                skipped_count += 1
                continue
                
            # Create default storefront
            default_storefront = {
                "user_id": user_id,
                "dispensary_name": user.get("store_name", "Cannabis Dispensary"),
                "description": "Premium cannabis products with fast delivery",
                "theme_color": "#10B981",
                "contact_phone": user.get("phone"),
                "contact_email": user.get("email"),
                "address": user.get("address"),
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
                "seo_title": f"{user.get('store_name', 'Cannabis Dispensary')} - Premium Cannabis Products",
                "seo_description": "Browse our premium cannabis selection with delivery and pickup options.",
                "custom_css": "",
                "announcement_banner": "",
                "is_active": True
            }
            
            # Insert the storefront
            result = await db.storefronts.insert_one(default_storefront)
            created_count += 1
            logger.info(f"✓ Created default storefront for user {user_id} (email: {user.get('email')})")
            
        logger.info(f"\n✓ Created {created_count} storefronts for existing users!")
        logger.info(f"- Skipped {skipped_count} users who already had storefronts")
        logger.info(f"- Total users processed: {len(users)}")
        
    except Exception as e:
        logger.error(f"Error creating storefronts: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(create_storefronts_for_existing_users())
