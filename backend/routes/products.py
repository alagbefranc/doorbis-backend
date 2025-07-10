from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.product import Product, ProductCreate, ProductUpdate
from auth.auth import get_current_active_user

router = APIRouter(prefix="/products", tags=["Products"])

# Use the global database function
get_database = getattr(__builtins__, 'get_database', None)

@router.get("/", response_model=List[Product])
async def get_products(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all products for the current user's store"""
    products = await db.products.find({"user_id": current_user["id"]}).to_list(1000)
    return [Product(**product) for product in products]

@router.post("/", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new product"""
    product_dict = product_data.dict()
    product_dict["user_id"] = current_user["id"]
    
    new_product = Product(**product_dict)
    await db.products.insert_one(new_product.dict())
    
    return new_product

@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific product"""
    product = await db.products.find_one({
        "id": product_id, 
        "user_id": current_user["id"]
    })
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return Product(**product)

@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a product"""
    # Check if product exists and belongs to user
    existing_product = await db.products.find_one({
        "id": product_id,
        "user_id": current_user["id"]
    })
    
    if not existing_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update only provided fields
    update_data = product_update.dict(exclude_unset=True)
    if update_data:
        await db.products.update_one(
            {"id": product_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated product
    updated_product = await db.products.find_one({
        "id": product_id,
        "user_id": current_user["id"]
    })
    
    return Product(**updated_product)

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a product"""
    result = await db.products.delete_one({
        "id": product_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return {"message": "Product deleted successfully"}

@router.get("/stats/overview")
async def get_product_stats(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get product statistics overview"""
    total_products = await db.products.count_documents({"user_id": current_user["id"]})
    active_products = await db.products.count_documents({
        "user_id": current_user["id"],
        "status": "active"
    })
    low_stock = await db.products.count_documents({
        "user_id": current_user["id"],
        "stock": {"$lt": 10, "$gt": 0}
    })
    out_of_stock = await db.products.count_documents({
        "user_id": current_user["id"],
        "stock": 0
    })
    
    return {
        "total_products": total_products,
        "active_products": active_products,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock
    }