from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.payment import Payment, PaymentCreate, PaymentUpdate, Payout
from auth.auth import get_current_active_user

router = APIRouter(prefix="/payments", tags=["Payments"])

async def get_database():
    # This will be injected by dependency
    pass

@router.get("/", response_model=List[Payment])
async def get_payments(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all payments for the current user's store"""
    payments = await db.payments.find({"user_id": current_user["id"]}).to_list(1000)
    return [Payment(**payment) for payment in payments]

@router.post("/", response_model=Payment)
async def create_payment(
    payment_data: PaymentCreate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new payment record"""
    payment_dict = payment_data.dict()
    payment_dict["user_id"] = current_user["id"]
    
    new_payment = Payment(**payment_dict)
    await db.payments.insert_one(new_payment.dict())
    
    return new_payment

@router.get("/{payment_id}", response_model=Payment)
async def get_payment(
    payment_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific payment"""
    payment = await db.payments.find_one({
        "id": payment_id,
        "user_id": current_user["id"]
    })
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    return Payment(**payment)

@router.put("/{payment_id}", response_model=Payment)
async def update_payment(
    payment_id: str,
    payment_update: PaymentUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a payment"""
    # Check if payment exists and belongs to user
    existing_payment = await db.payments.find_one({
        "id": payment_id,
        "user_id": current_user["id"]
    })
    
    if not existing_payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Update only provided fields
    update_data = payment_update.dict(exclude_unset=True)
    if update_data:
        await db.payments.update_one(
            {"id": payment_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated payment
    updated_payment = await db.payments.find_one({
        "id": payment_id,
        "user_id": current_user["id"]
    })
    
    return Payment(**updated_payment)

@router.get("/stats/overview")
async def get_payment_stats(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get payment statistics overview"""
    # Total revenue
    revenue_pipeline = [
        {"$match": {"user_id": current_user["id"], "status": "completed"}},
        {"$group": {"_id": None, "total_revenue": {"$sum": "$amount"}}}
    ]
    revenue_result = await db.payments.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total_revenue"] if revenue_result else 0
    
    # Total fees
    fees_pipeline = [
        {"$match": {"user_id": current_user["id"], "status": "completed"}},
        {"$group": {"_id": None, "total_fees": {"$sum": "$fee"}}}
    ]
    fees_result = await db.payments.aggregate(fees_pipeline).to_list(1)
    total_fees = fees_result[0]["total_fees"] if fees_result else 0
    
    # Pending payouts
    pending_payouts_pipeline = [
        {"$match": {"user_id": current_user["id"], "status": "pending"}},
        {"$group": {"_id": None, "pending_amount": {"$sum": "$net_amount"}}}
    ]
    pending_result = await db.payments.aggregate(pending_payouts_pipeline).to_list(1)
    pending_payouts = pending_result[0]["pending_amount"] if pending_result else 0
    
    # Refunds
    refunds_pipeline = [
        {"$match": {"user_id": current_user["id"], "status": "refunded"}},
        {"$group": {"_id": None, "total_refunds": {"$sum": "$amount"}}}
    ]
    refunds_result = await db.payments.aggregate(refunds_pipeline).to_list(1)
    total_refunds = refunds_result[0]["total_refunds"] if refunds_result else 0
    
    return {
        "total_revenue": total_revenue,
        "processing_fees": total_fees,
        "pending_payouts": pending_payouts,
        "total_refunds": total_refunds
    }

@router.get("/payouts/", response_model=List[Payout])
async def get_payouts(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all payouts for the current user's store"""
    payouts = await db.payouts.find({"user_id": current_user["id"]}).to_list(1000)
    return [Payout(**payout) for payout in payouts]

@router.post("/refund/{payment_id}")
async def refund_payment(
    payment_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Refund a payment"""
    payment = await db.payments.find_one({
        "id": payment_id,
        "user_id": current_user["id"],
        "status": "completed"
    })
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found or cannot be refunded"
        )
    
    # Update payment status to refunded
    await db.payments.update_one(
        {"id": payment_id, "user_id": current_user["id"]},
        {"$set": {"status": "refunded"}}
    )
    
    return {"message": "Payment refunded successfully"}