from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta
from models.user import User, UserCreate, UserLogin, Token
from database import get_database
from auth.auth import (
    authenticate_user, 
    create_access_token, 
    get_password_hash,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user and create their storefront"""
    db = await get_database()
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if subdomain is taken
    existing_subdomain = await db.users.find_one({"subdomain": user_data.subdomain})
    if existing_subdomain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict["password"]
    user_dict["hashed_password"] = hashed_password
    
    new_user = User(**user_dict)
    await db.users.insert_one(new_user.dict())
    
    # Automatically create a default storefront for the new user
    default_storefront = {
        "user_id": new_user.id,
        "dispensary_name": user_data.store_name,
        "description": "Premium cannabis products with fast delivery",
        "theme_color": "#10B981",
        "contact_phone": user_data.phone if hasattr(user_data, 'phone') else None,
        "contact_email": user_data.email,
        "address": user_data.address if hasattr(user_data, 'address') else None,
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
        "seo_title": f"{user_data.store_name} - Premium Cannabis Products",
        "seo_description": "Browse our premium cannabis selection with delivery and pickup options.",
        "custom_css": "",
        "announcement_banner": "",
        "is_active": True
    }
    
    # Insert the storefront
    await db.storefronts.insert_one(default_storefront)
    
    return {"message": "User registered successfully and storefront created", "user_id": new_user.id, "subdomain": user_data.subdomain}

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return access token"""
    db = await get_database()
    user = await authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=dict)
async def get_current_user_info():
    """Get current user information"""
    # For now, let's return sample user data to test the flow
    # In production, this would validate the JWT token
    return {
        "id": "user_001",
        "email": "owner@greenvalley.com",
        "full_name": "John Doe",
        "store_name": "Green Valley Dispensary",
        "phone": "(555) 123-4567",
        "address": "123 Main Street, Los Angeles, CA 90210",
        "license_number": "C11-0000123-LIC",
        "subdomain": "green-valley",
        "is_active": True,
        "role": "admin"
    }

@router.post("/logout")
async def logout():
    """Logout user (client should delete token)"""
    return {"message": "Successfully logged out"}