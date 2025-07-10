from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime
from models.order import Order, OrderCreate, OrderUpdate
from auth.auth import get_current_active_user
from database import get_database

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[Order])
async def get_orders(
    current_user: dict = Depends(get_current_active_user)
):
    """Get all orders for the current user's store"""
    db = await get_database()
    orders = await db.orders.find({"user_id": current_user["id"]}).to_list(1000)
    return [Order(**order) for order in orders]

@router.post("/", response_model=Order)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new order"""
    db = await get_database()
    order_dict = order_data.dict()
    order_dict["user_id"] = current_user["id"]
    
    new_order = Order(**order_dict)
    await db.orders.insert_one(new_order.dict())
    
    # Update customer data if exists
    await update_customer_stats(db, order_data.customer_email, order_data.total, current_user["id"])
    
    return new_order

@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific order"""
    db = await get_database()
    order = await db.orders.find_one({
        "id": order_id,
        "user_id": current_user["id"]
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return Order(**order)

@router.put("/{order_id}", response_model=Order)
async def update_order(
    order_id: str,
    order_update: OrderUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update an order"""
    db = await get_database()
    # Check if order exists and belongs to user
    existing_order = await db.orders.find_one({
        "id": order_id,
        "user_id": current_user["id"]
    })
    
    if not existing_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update only provided fields
    update_data = order_update.dict(exclude_unset=True)
    if update_data:
        await db.orders.update_one(
            {"id": order_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated order
    updated_order = await db.orders.find_one({
        "id": order_id,
        "user_id": current_user["id"]
    })
    
    return Order(**updated_order)

@router.delete("/{order_id}")
async def delete_order(
    order_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Delete an order"""
    db = await get_database()
    result = await db.orders.delete_one({
        "id": order_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return {"message": "Order deleted successfully"}

@router.get("/stats/overview")
async def get_order_stats(
    current_user: dict = Depends(get_current_active_user)
):
    """Get order statistics overview"""
    db = await get_database()
    total_orders = await db.orders.count_documents({"user_id": current_user["id"]})
    pending_orders = await db.orders.count_documents({
        "user_id": current_user["id"],
        "status": "pending"
    })
    in_transit = await db.orders.count_documents({
        "user_id": current_user["id"],
        "status": "en-route"
    })
    delivered_today = await db.orders.count_documents({
        "user_id": current_user["id"],
        "status": "delivered"
    })
    
    # Calculate total revenue
    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$total"}}}
    ]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "in_transit": in_transit,
        "delivered_today": delivered_today,
        "total_revenue": total_revenue
    }

async def update_customer_stats(db: AsyncIOMotorDatabase, customer_email: str, order_total: float, user_id: str):
    """Update customer statistics when new order is placed"""
    customer = await db.customers.find_one({
        "email": customer_email,
        "user_id": user_id
    })
    
    if customer:
        new_total_orders = customer["total_orders"] + 1
        new_total_spent = customer["total_spent"] + order_total
        new_avg_order = new_total_spent / new_total_orders
        
        await db.customers.update_one(
            {"email": customer_email, "user_id": user_id},
            {
                "$set": {
                    "total_orders": new_total_orders,
                    "total_spent": new_total_spent,
                    "average_order_value": new_avg_order,
                    "last_order_date": datetime.utcnow()
                }
            }
        )