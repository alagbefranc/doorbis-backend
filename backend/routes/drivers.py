from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.driver import Driver, DriverCreate, DriverUpdate
from auth.auth import get_current_active_user
from database import get_database

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/", response_model=List[Driver])
async def get_drivers(
    current_user: dict = Depends(get_current_active_user)
):
    """Get all drivers for the current user's store"""
    db = await get_database()
    drivers = await db.drivers.find({"user_id": current_user["id"]}).to_list(1000)
    return [Driver(**driver) for driver in drivers]

@router.post("/", response_model=Driver)
async def create_driver(
    driver_data: DriverCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new driver"""
    db = await get_database()
    # Check if driver already exists
    existing_driver = await db.drivers.find_one({
        "email": driver_data.email,
        "user_id": current_user["id"]
    })
    
    if existing_driver:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver with this email already exists"
        )
    
    driver_dict = driver_data.dict()
    driver_dict["user_id"] = current_user["id"]
    
    new_driver = Driver(**driver_dict)
    await db.drivers.insert_one(new_driver.dict())
    
    return new_driver

@router.get("/{driver_id}", response_model=Driver)
async def get_driver(
    driver_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific driver"""
    db = await get_database()
    driver = await db.drivers.find_one({
        "id": driver_id,
        "user_id": current_user["id"]
    })
    
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    
    return Driver(**driver)

@router.put("/{driver_id}", response_model=Driver)
async def update_driver(
    driver_id: str,
    driver_update: DriverUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update a driver"""
    db = await get_database()
    # Check if driver exists and belongs to user
    existing_driver = await db.drivers.find_one({
        "id": driver_id,
        "user_id": current_user["id"]
    })
    
    if not existing_driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    
    # Update only provided fields
    update_data = driver_update.dict(exclude_unset=True)
    if update_data:
        await db.drivers.update_one(
            {"id": driver_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated driver
    updated_driver = await db.drivers.find_one({
        "id": driver_id,
        "user_id": current_user["id"]
    })
    
    return Driver(**updated_driver)

@router.delete("/{driver_id}")
async def delete_driver(
    driver_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Delete a driver"""
    db = await get_database()
    result = await db.drivers.delete_one({
        "id": driver_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    
    return {"message": "Driver deleted successfully"}

@router.get("/stats/overview")
async def get_driver_stats(
    current_user: dict = Depends(get_current_active_user)
):
    """Get driver statistics overview"""
    db = await get_database()
    total_drivers = await db.drivers.count_documents({"user_id": current_user["id"]})
    active_drivers = await db.drivers.count_documents({
        "user_id": current_user["id"],
        "status": "active"
    })
    on_delivery = await db.drivers.count_documents({
        "user_id": current_user["id"],
        "status": "on-delivery"
    })
    
    # Calculate average rating
    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
    ]
    rating_result = await db.drivers.aggregate(pipeline).to_list(1)
    avg_rating = rating_result[0]["avg_rating"] if rating_result else 0
    
    return {
        "total_drivers": total_drivers,
        "active_drivers": active_drivers,
        "on_delivery": on_delivery,
        "average_rating": round(avg_rating, 1)
    }

@router.put("/{driver_id}/status")
async def update_driver_status(
    driver_id: str,
    status: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Update driver status"""
    db = await get_database()
    valid_statuses = ["active", "on-delivery", "offline"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    result = await db.drivers.update_one(
        {"id": driver_id, "user_id": current_user["id"]},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    
    return {"message": f"Driver status updated to {status}"}