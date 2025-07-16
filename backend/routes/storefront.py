from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
from database import get_database
from auth.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

class StorefrontConfig(BaseModel):
    dispensary_name: str
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    description: Optional[str] = None
    theme_color: str = "#10B981"  # Default green
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    address: Optional[str] = None
    hours: Optional[Dict[str, str]] = None  # e.g., {"monday": "9AM-8PM", "tuesday": "9AM-8PM"}
    social_media: Optional[Dict[str, str]] = None  # e.g., {"instagram": "@dispensary", "facebook": "dispensary"}
    features: Optional[Dict[str, Any]] = None  # e.g., {"delivery": True, "pickup": True}
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    custom_css: Optional[str] = None
    announcement_banner: Optional[str] = None
    is_active: bool = True

class StorefrontUpdate(BaseModel):
    dispensary_name: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    description: Optional[str] = None
    theme_color: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    address: Optional[str] = None
    hours: Optional[Dict[str, str]] = None
    social_media: Optional[Dict[str, str]] = None
    features: Optional[Dict[str, Any]] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    custom_css: Optional[str] = None
    announcement_banner: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("/storefront/config")
async def get_storefront_config(current_user: dict = Depends(get_current_user)):
    """
    Get storefront configuration for the current user's dispensary
    """
    try:
        db = await get_database()
        
        # Get the dispensary's storefront config
        config = await db.storefronts.find_one({"user_id": current_user["id"]})
        
        if not config:
            # Return default config if none exists
            return {
                "dispensary_name": "My Dispensary",
                "logo_url": None,
                "banner_url": None,
                "description": "Welcome to our cannabis dispensary",
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
                "seo_title": "My Dispensary - Premium Cannabis Products",
                "seo_description": "Browse our premium cannabis selection with delivery and pickup options.",
                "custom_css": "",
                "announcement_banner": "",
                "is_active": True
            }
        
        # Remove MongoDB ObjectId from response
        config.pop('_id', None)
        return config
        
    except Exception as e:
        logger.error(f"Error getting storefront config: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve storefront configuration")

@router.put("/storefront/config")
async def update_storefront_config(
    config: StorefrontUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update storefront configuration for the current user's dispensary
    """
    try:
        db = await get_database()
        
        # Prepare update data (only include non-None values)
        update_data = {k: v for k, v in config.dict().items() if v is not None}
        update_data["user_id"] = current_user["id"]
        
        # Update or create storefront config
        result = await db.storefronts.update_one(
            {"user_id": current_user["id"]},
            {"$set": update_data},
            upsert=True
        )
        
        if result.matched_count == 0 and result.upserted_id is None:
            raise HTTPException(status_code=500, detail="Failed to update storefront configuration")
        
        # Return updated config
        updated_config = await db.storefronts.find_one({"user_id": current_user["id"]})
        updated_config.pop('_id', None)
        updated_config.pop('user_id', None)
        
        return {
            "success": True,
            "message": "Storefront configuration updated successfully",
            "data": updated_config
        }
        
    except Exception as e:
        logger.error(f"Error updating storefront config: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update storefront configuration")

@router.get("/storefront/public/{user_id}")
async def get_public_storefront(user_id: str):
    """
    Get public storefront view for customers (no authentication required)
    """
    try:
        db = await get_database()
        
        # Get storefront config
        config = await db.storefronts.find_one({"user_id": user_id, "is_active": True})
        
        if not config:
            raise HTTPException(status_code=404, detail="Storefront not found")
        
        # Get products for this user (show only active products)
        products = await db.products.find({
            "user_id": user_id, 
            "status": "active"
        }).to_list(None)
        
        # Remove sensitive data
        config.pop('_id', None)
        config.pop('user_id', None)
        
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
        
        return {
            "storefront": config,
            "products": public_products
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting public storefront: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve storefront")

@router.get("/storefront/slug/{slug}")
async def get_storefront_by_slug(slug: str):
    """
    Get public storefront view by slug/subdomain (no authentication required)
    """
    try:
        db = await get_database()
        
        # First, find the user by subdomain (case-insensitive)
        import re
        user = await db.users.find_one({"subdomain": re.compile(f"^{re.escape(slug)}$", re.IGNORECASE)})
        if not user:
            # Log the lookup failure for debugging
            logger.info(f"Storefront slug not found: {slug}")
            raise HTTPException(status_code=404, detail="Store not found")
        
        user_id = user["id"]
        logger.info(f"Found storefront for slug: {slug}, user: {user.get('email')}")
        
        # Get storefront config
        config = await db.storefronts.find_one({"user_id": user_id, "is_active": True})
        
        if not config:
            raise HTTPException(status_code=404, detail="Storefront not found")
        
        # Get products for this user (show only active products)
        products = await db.products.find({
            "user_id": user_id, 
            "status": "active"
        }).to_list(None)
        
        # Remove sensitive data
        config.pop('_id', None)
        config.pop('user_id', None)
        
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
        
        return {
            "storefront": config,
            "products": public_products
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting storefront by slug: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve storefront")

@router.get("/storefront/preview")
async def get_storefront_preview(current_user: dict = Depends(get_current_user)):
    """
    Get a preview of the storefront for the dashboard
    """
    try:
        db = await get_database()
        
        # Get storefront config
        config = await db.storefronts.find_one({"user_id": current_user["id"]})
        
        if not config:
            config = {
                "dispensary_name": "My Dispensary",
                "description": "Welcome to our cannabis dispensary",
                "theme_color": "#10B981",
                "is_active": True
            }
        
        # Get featured products (first 6)
        products = await db.products.find({"user_id": current_user["id"], "status": "active"}).limit(6).to_list(None)
        
        # Remove sensitive data
        config.pop('_id', None)
        config.pop('user_id', None)
        
        # Format products for preview
        preview_products = []
        for product in products:
            preview_products.append({
                "id": str(product["_id"]),
                "name": product["name"],
                "category": product["category"],
                "price": product["price"],
                "image_emoji": product.get("image_emoji", "🌿"),
                "in_stock": product["stock"] > 0
            })
        
        return {
            "storefront": config,
            "featured_products": preview_products
        }
        
    except Exception as e:
        logger.error(f"Error getting storefront preview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve storefront preview")

@router.get("/storefront/stats")
async def get_storefront_stats(current_user: dict = Depends(get_current_user)):
    """
    Get storefront statistics for the dashboard
    """
    try:
        db = await get_database()
        
        # Get view stats (this would typically come from analytics)
        # For now, we'll return mock data
        stats = {
            "total_views": 1250,
            "views_this_week": 345,
            "conversion_rate": 3.2,
            "avg_order_value": 85.50,
            "top_products": [
                {"name": "Blue Dream", "views": 125},
                {"name": "Sour Diesel", "views": 98},
                {"name": "OG Kush", "views": 87}
            ]
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting storefront stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve storefront statistics")

@router.get("/storefront/product/{slug}/{product_id}")
async def get_product_by_id(slug: str, product_id: str):
    """
    Get a specific product by ID for the product detail page
    """
    try:
        from bson import ObjectId
        db = await get_database()
        
        # First, find the user by subdomain
        user = await db.users.find_one({"subdomain": slug})
        if not user:
            raise HTTPException(status_code=404, detail="Store not found")
        
        user_id = user["id"]
        
        # Get the specific product
        product = await db.products.find_one({
            "_id": ObjectId(product_id),
            "user_id": user_id, 
            "status": "active"
        })
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get storefront config for dispensary info
        config = await db.storefronts.find_one({"user_id": user_id, "is_active": True})
        
        # Format product for public view
        public_product = {
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
        }
        
        # Format storefront info
        storefront_info = {
            "dispensary_name": config.get("dispensary_name", "Cannabis Store") if config else "Cannabis Store",
            "theme_color": config.get("theme_color", "#10B981") if config else "#10B981"
        }
        
        return {
            "product": public_product,
            "storefront": storefront_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product by ID: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve product")

@router.get("/storefront/debug/{user_id}")
async def debug_storefront(user_id: str):
    """
    Debug endpoint to check storefront and products for a user
    """
    try:
        db = await get_database()
        
        # Get storefront config
        config = await db.storefronts.find_one({"user_id": user_id})
        
        # Get all products for this user
        all_products = await db.products.find({"user_id": user_id}).to_list(None)
        
        # Get active products
        active_products = await db.products.find({
            "user_id": user_id, 
            "status": {"$ne": "deleted"}
        }).to_list(None)
        
        # Summary
        product_status_counts = {}
        for product in all_products:
            status = product.get('status', 'missing')
            product_status_counts[status] = product_status_counts.get(status, 0) + 1
        
        return {
            "user_id": user_id,
            "storefront_exists": config is not None,
            "storefront_active": config.get('is_active', False) if config else False,
            "dispensary_name": config.get('dispensary_name', 'N/A') if config else 'N/A',
            "total_products": len(all_products),
            "visible_products": len(active_products),
            "product_status_counts": product_status_counts,
            "products": [
                {
                    "id": str(p.get('_id', 'unknown')),
                    "name": p.get('name', 'unnamed'),
                    "status": p.get('status', 'missing'),
                    "stock": p.get('stock', 0),
                    "category": p.get('category', 'unknown')
                } for p in all_products
            ]
        }
        
    except Exception as e:
        logger.error(f"Error debugging storefront: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to debug storefront")
