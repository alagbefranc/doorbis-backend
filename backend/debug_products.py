#!/usr/bin/env python3
"""
Debug script to check product status and ensure all products show in storefront
"""
import asyncio
import sys
from database import get_database
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_products():
    """Check all products in the database and their status"""
    try:
        db = await get_database()
        
        # Get all products
        all_products = await db.products.find({}).to_list(None)
        
        logger.info(f"Total products found: {len(all_products)}")
        
        # Group by user_id
        users = {}
        for product in all_products:
            user_id = product.get('user_id', 'unknown')
            if user_id not in users:
                users[user_id] = []
            users[user_id].append(product)
        
        for user_id, products in users.items():
            logger.info(f"\nUser ID: {user_id}")
            logger.info(f"  Total products: {len(products)}")
            
            # Check status distribution
            status_counts = {}
            products_without_status = []
            
            for product in products:
                status = product.get('status', 'missing')
                if status == 'missing':
                    products_without_status.append(product)
                status_counts[status] = status_counts.get(status, 0) + 1
                
                logger.info(f"    - {product.get('name', 'unnamed')}: status='{status}', stock={product.get('stock', 0)}")
            
            logger.info(f"  Status distribution: {status_counts}")
            
            if products_without_status:
                logger.warning(f"  Found {len(products_without_status)} products without status field!")
                
                # Fix products without status
                for product in products_without_status:
                    logger.info(f"    Fixing product: {product.get('name', 'unnamed')}")
                    await db.products.update_one(
                        {"_id": product["_id"]},
                        {"$set": {"status": "active"}}
                    )
                    logger.info(f"    ✓ Set status to 'active' for {product.get('name', 'unnamed')}")
        
        # Check storefronts
        storefronts = await db.storefronts.find({}).to_list(None)
        logger.info(f"\nStorefronts found: {len(storefronts)}")
        
        for storefront in storefronts:
            user_id = storefront.get('user_id', 'unknown')
            is_active = storefront.get('is_active', False)
            dispensary_name = storefront.get('dispensary_name', 'unnamed')
            logger.info(f"  - User: {user_id}, Name: {dispensary_name}, Active: {is_active}")
        
        logger.info("\n✓ Product status check complete!")
        
    except Exception as e:
        logger.error(f"Error checking products: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check_products())
