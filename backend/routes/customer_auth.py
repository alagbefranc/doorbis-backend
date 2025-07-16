from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import logging

from models.customer_auth import (
    CustomerAuth, CustomerSignup, CustomerLogin, CustomerProfile, 
    CustomerUpdateProfile, CustomerAuthResponse
)
from database import get_database

router = APIRouter(prefix="/customer", tags=["Customer Authentication"])
logger = logging.getLogger(__name__)

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT settings
SECRET_KEY = "your-secret-key-here"  # In production, use a real secret key from environment
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_customer(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current customer from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id: str = payload.get("sub")
        if customer_id is None:
            raise credentials_exception
        token_data = {"customer_id": customer_id}
    except JWTError:
        raise credentials_exception
    
    db = await get_database()
    customer = await db.customer_auth.find_one({"id": customer_id})
    if customer is None:
        raise credentials_exception
    return customer

@router.post("/signup", response_model=CustomerAuthResponse)
async def customer_signup(signup_data: CustomerSignup):
    """Sign up a new customer for a specific store"""
    try:
        db = await get_database()
        
        # Get store information from slug
        store_user = await db.users.find_one({"subdomain": signup_data.store_slug})
        if not store_user:
            raise HTTPException(
                status_code=404,
                detail="Store not found"
            )
        
        store_id = store_user["id"]
        
        # Check if customer already exists for this store
        existing_customer = await db.customer_auth.find_one({
            "email": signup_data.email,
            "store_id": store_id
        })
        
        if existing_customer:
            raise HTTPException(
                status_code=400,
                detail="Customer with this email already exists for this store"
            )
        
        # Hash password
        password_hash = get_password_hash(signup_data.password)
        
        # Create new customer
        new_customer = CustomerAuth(
            name=signup_data.name,
            email=signup_data.email,
            phone=signup_data.phone,
            password_hash=password_hash,
            address=signup_data.address,
            date_of_birth=signup_data.date_of_birth,
            store_id=store_id
        )
        
        # Insert into database
        await db.customer_auth.insert_one(new_customer.dict())
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_customer.id}, expires_delta=access_token_expires
        )
        
        # Create customer profile response
        customer_profile = CustomerProfile(
            id=new_customer.id,
            name=new_customer.name,
            email=new_customer.email,
            phone=new_customer.phone,
            address=new_customer.address,
            total_orders=new_customer.total_orders,
            total_spent=new_customer.total_spent,
            loyalty_tier=new_customer.loyalty_tier,
            status=new_customer.status,
            created_at=new_customer.created_at,
            last_order_date=new_customer.last_order_date
        )
        
        return CustomerAuthResponse(
            success=True,
            message="Customer account created successfully",
            customer=customer_profile,
            token=access_token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during customer signup: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create customer account"
        )

@router.post("/login", response_model=CustomerAuthResponse)
async def customer_login(login_data: CustomerLogin):
    """Log in a customer"""
    try:
        db = await get_database()
        
        # Get store information from slug
        store_user = await db.users.find_one({"subdomain": login_data.store_slug})
        if not store_user:
            raise HTTPException(
                status_code=404,
                detail="Store not found"
            )
        
        store_id = store_user["id"]
        
        # Find customer
        customer = await db.customer_auth.find_one({
            "email": login_data.email,
            "store_id": store_id
        })
        
        if not customer:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(login_data.password, customer["password_hash"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Check if customer is active
        if customer["status"] != "active":
            raise HTTPException(
                status_code=401,
                detail="Customer account is not active"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": customer["id"]}, expires_delta=access_token_expires
        )
        
        # Create customer profile response
        customer_profile = CustomerProfile(
            id=customer["id"],
            name=customer["name"],
            email=customer["email"],
            phone=customer["phone"],
            address=customer.get("address"),
            total_orders=customer["total_orders"],
            total_spent=customer["total_spent"],
            loyalty_tier=customer["loyalty_tier"],
            status=customer["status"],
            created_at=customer["created_at"],
            last_order_date=customer.get("last_order_date")
        )
        
        return CustomerAuthResponse(
            success=True,
            message="Login successful",
            customer=customer_profile,
            token=access_token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during customer login: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to log in customer"
        )

@router.get("/profile", response_model=CustomerProfile)
async def get_customer_profile(current_customer: dict = Depends(get_current_customer)):
    """Get current customer's profile"""
    return CustomerProfile(
        id=current_customer["id"],
        name=current_customer["name"],
        email=current_customer["email"],
        phone=current_customer["phone"],
        address=current_customer.get("address"),
        total_orders=current_customer["total_orders"],
        total_spent=current_customer["total_spent"],
        loyalty_tier=current_customer["loyalty_tier"],
        status=current_customer["status"],
        created_at=current_customer["created_at"],
        last_order_date=current_customer.get("last_order_date")
    )

@router.put("/profile", response_model=CustomerProfile)
async def update_customer_profile(
    profile_update: CustomerUpdateProfile,
    current_customer: dict = Depends(get_current_customer)
):
    """Update customer profile"""
    try:
        db = await get_database()
        
        # Prepare update data
        update_data = profile_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        # Update customer in database
        await db.customer_auth.update_one(
            {"id": current_customer["id"]},
            {"$set": update_data}
        )
        
        # Get updated customer
        updated_customer = await db.customer_auth.find_one({"id": current_customer["id"]})
        
        return CustomerProfile(
            id=updated_customer["id"],
            name=updated_customer["name"],
            email=updated_customer["email"],
            phone=updated_customer["phone"],
            address=updated_customer.get("address"),
            total_orders=updated_customer["total_orders"],
            total_spent=updated_customer["total_spent"],
            loyalty_tier=updated_customer["loyalty_tier"],
            status=updated_customer["status"],
            created_at=updated_customer["created_at"],
            last_order_date=updated_customer.get("last_order_date")
        )
        
    except Exception as e:
        logger.error(f"Error updating customer profile: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to update customer profile"
        )

@router.post("/logout")
async def customer_logout():
    """Log out customer (client-side token removal)"""
    return {"success": True, "message": "Logged out successfully"}

@router.get("/orders")
async def get_customer_orders(current_customer: dict = Depends(get_current_customer)):
    """Get customer's order history"""
    try:
        db = await get_database()
        
        # Get customer's orders
        orders = await db.orders.find({
            "customer_id": current_customer["id"]
        }).sort("created_at", -1).to_list(100)
        
        return {
            "success": True,
            "orders": orders
        }
        
    except Exception as e:
        logger.error(f"Error getting customer orders: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get customer orders"
        )
