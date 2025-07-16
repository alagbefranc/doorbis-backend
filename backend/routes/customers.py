from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.customer import Customer, CustomerCreate, CustomerUpdate
from auth.auth import get_current_active_user
from database import get_database

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=List[Customer])
async def get_customers(
    current_user: dict = Depends(get_current_active_user)
):
    """Get all customers for the current user's store"""
    db = await get_database()
    
    # Get customers from BOTH collections to ensure we show all customers
    
    # 1. Get customers from the storefront customer_auth collection
    storefront_customers = await db.customer_auth.find({"store_id": current_user["id"]}).to_list(1000)
    
    # 2. Get customers from the regular customers collection
    regular_customers = await db.customers.find({"user_id": current_user["id"]}).to_list(1000)
    
    # Convert storefront customers to the Customer model format
    all_customers = []
    
    # Add storefront customers (convert format)
    for customer in storefront_customers:
        # Convert customer_auth format to customer format
        customer_data = {
            "id": customer.get("id"),
            "name": customer.get("name"),
            "email": customer.get("email"),
            "phone": customer.get("phone"),
            "address": customer.get("address", ""),
            "total_orders": customer.get("total_orders", 0),
            "total_spent": customer.get("total_spent", 0.0),
            "average_order_value": customer.get("total_spent", 0.0) / max(customer.get("total_orders", 1), 1),
            "loyalty_tier": customer.get("loyalty_tier", "bronze"),
            "status": customer.get("status", "active"),
            "created_at": customer.get("created_at"),
            "last_order_date": customer.get("last_order_date"),
            "user_id": current_user["id"],
            "source": "storefront"  # Add a field to identify the source
        }
        
        all_customers.append(Customer(**customer_data))
    
    # Add regular customers (they're already in the right format)
    for customer in regular_customers:
        # Skip if we already have this customer from storefront
        existing_emails = [c.email for c in all_customers]
        if customer.get("email") not in existing_emails:
            all_customers.append(Customer(**customer))
    
    return all_customers

@router.post("/", response_model=Customer)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new customer"""
    db = await get_database()
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
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific customer"""
    db = await get_database()
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
    current_user: dict = Depends(get_current_active_user)
):
    """Update a customer"""
    db = await get_database()
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
    current_user: dict = Depends(get_current_active_user)
):
    """Delete a customer"""
    db = await get_database()
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
    current_user: dict = Depends(get_current_active_user)
):
    """Get customer statistics overview"""
    db = await get_database()
    
    # Get customers from both collections
    storefront_customers_count = await db.customer_auth.count_documents({"store_id": current_user["id"]})
    regular_customers_count = await db.customers.count_documents({"user_id": current_user["id"]})
    
    # Get unique customers (avoid double counting)
    storefront_customers = await db.customer_auth.find({"store_id": current_user["id"]}).to_list(1000)
    regular_customers = await db.customers.find({"user_id": current_user["id"]}).to_list(1000)
    
    # Create a set of unique emails to avoid double counting
    unique_emails = set()
    total_spent = 0
    total_orders = 0
    active_count = 0
    repeat_customers_count = 0
    
    # Process storefront customers
    for customer in storefront_customers:
        email = customer.get("email")
        if email not in unique_emails:
            unique_emails.add(email)
            total_spent += customer.get("total_spent", 0.0)
            total_orders += customer.get("total_orders", 0)
            if customer.get("status") == "active":
                active_count += 1
            if customer.get("total_orders", 0) > 1:
                repeat_customers_count += 1
    
    # Process regular customers (only if not already counted)
    for customer in regular_customers:
        email = customer.get("email")
        if email not in unique_emails:
            unique_emails.add(email)
            total_spent += customer.get("total_spent", 0.0)
            total_orders += customer.get("total_orders", 0)
            if customer.get("status") == "active":
                active_count += 1
            if customer.get("total_orders", 0) > 1:
                repeat_customers_count += 1
    
    total_customers = len(unique_emails)
    avg_order_value = (total_spent / total_orders) if total_orders > 0 else 0
    repeat_percentage = (repeat_customers_count / total_customers * 100) if total_customers > 0 else 0
    
    return {
        "total_customers": total_customers,
        "active_customers": active_count,
        "avg_order_value": round(avg_order_value, 2),
        "repeat_customers_percentage": round(repeat_percentage, 1),
        "repeat_customers_count": repeat_customers_count
    }

@router.get("/loyalty/tiers")
async def get_loyalty_tiers(
    current_user: dict = Depends(get_current_active_user)
):
    """Get loyalty tier statistics"""
    db = await get_database()
    
    # For shop admins, only count storefront customers
    bronze_count = await db.customer_auth.count_documents({
        "store_id": current_user["id"],
        "loyalty_tier": "bronze"
    })
    silver_count = await db.customer_auth.count_documents({
        "store_id": current_user["id"],
        "loyalty_tier": "silver"
    })
    gold_count = await db.customer_auth.count_documents({
        "store_id": current_user["id"],
        "loyalty_tier": "gold"
    })
    platinum_count = await db.customer_auth.count_documents({
        "store_id": current_user["id"],
        "loyalty_tier": "platinum"
    })
    
    return {
        "bronze": {"count": bronze_count, "min_spent": 0, "discount": "5%"},
        "silver": {"count": silver_count, "min_spent": 500, "discount": "10%"},
        "gold": {"count": gold_count, "min_spent": 1500, "discount": "15%"},
        "platinum": {"count": platinum_count, "min_spent": 3000, "discount": "20%"}
    }
