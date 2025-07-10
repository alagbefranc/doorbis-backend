from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from ..models.customer import Customer, CustomerCreate, CustomerUpdate
from ..auth.auth import get_current_active_user

router = APIRouter(prefix="/customers", tags=["Customers"])

async def get_database():
    # This will be injected by dependency
    pass

@router.get("/", response_model=List[Customer])
async def get_customers(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all customers for the current user's store"""
    customers = await db.customers.find({"user_id": current_user["id"]}).to_list(1000)
    return [Customer(**customer) for customer in customers]

@router.post("/", response_model=Customer)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new customer"""
    # Check if customer already exists
    existing_customer = await db.customers.find_one({
        "email": customer_data.email,
        "user_id": current_user["id"]
    })
    
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer with this email already exists"
        )
    
    customer_dict = customer_data.dict()
    customer_dict["user_id"] = current_user["id"]
    
    new_customer = Customer(**customer_dict)
    await db.customers.insert_one(new_customer.dict())
    
    return new_customer

@router.get("/{customer_id}", response_model=Customer)
async def get_customer(
    customer_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific customer"""
    customer = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user["id"]
    })
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return Customer(**customer)

@router.put("/{customer_id}", response_model=Customer)
async def update_customer(
    customer_id: str,
    customer_update: CustomerUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a customer"""
    # Check if customer exists and belongs to user
    existing_customer = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user["id"]
    })
    
    if not existing_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Update only provided fields
    update_data = customer_update.dict(exclude_unset=True)
    if update_data:
        await db.customers.update_one(
            {"id": customer_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated customer
    updated_customer = await db.customers.find_one({
        "id": customer_id,
        "user_id": current_user["id"]
    })
    
    return Customer(**updated_customer)

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a customer"""
    result = await db.customers.delete_one({
        "id": customer_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return {"message": "Customer deleted successfully"}

@router.get("/stats/overview")
async def get_customer_stats(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get customer statistics overview"""
    total_customers = await db.customers.count_documents({"user_id": current_user["id"]})
    active_customers = await db.customers.count_documents({
        "user_id": current_user["id"],
        "status": "active"
    })
    
    # Calculate average order value
    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {"_id": None, "avg_order_value": {"$avg": "$average_order_value"}}}
    ]
    avg_result = await db.customers.aggregate(pipeline).to_list(1)
    avg_order_value = avg_result[0]["avg_order_value"] if avg_result else 0
    
    # Calculate repeat customers (customers with > 1 order)
    repeat_customers = await db.customers.count_documents({
        "user_id": current_user["id"],
        "total_orders": {"$gt": 1}
    })
    
    repeat_percentage = (repeat_customers / total_customers * 100) if total_customers > 0 else 0
    
    return {
        "total_customers": total_customers,
        "active_customers": active_customers,
        "avg_order_value": round(avg_order_value, 2),
        "repeat_customers_percentage": round(repeat_percentage, 1),
        "repeat_customers_count": repeat_customers
    }

@router.get("/loyalty/tiers")
async def get_loyalty_tiers(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get loyalty tier statistics"""
    bronze_count = await db.customers.count_documents({
        "user_id": current_user["id"],
        "loyalty_tier": "bronze"
    })
    silver_count = await db.customers.count_documents({
        "user_id": current_user["id"],
        "loyalty_tier": "silver"
    })
    gold_count = await db.customers.count_documents({
        "user_id": current_user["id"],
        "loyalty_tier": "gold"
    })
    platinum_count = await db.customers.count_documents({
        "user_id": current_user["id"],
        "loyalty_tier": "platinum"
    })
    
    return {
        "bronze": {"count": bronze_count, "min_spent": 0, "discount": "5%"},
        "silver": {"count": silver_count, "min_spent": 500, "discount": "10%"},
        "gold": {"count": gold_count, "min_spent": 1500, "discount": "15%"},
        "platinum": {"count": platinum_count, "min_spent": 3000, "discount": "20%"}
    }