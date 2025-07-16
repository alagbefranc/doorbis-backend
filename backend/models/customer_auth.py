from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class CustomerAuth(BaseModel):
    """Customer model with authentication fields for public storefront"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    password_hash: str
    address: Optional[str] = None
    date_of_birth: Optional[str] = None  # For age verification
    total_orders: int = 0
    total_spent: float = 0.0
    average_order_value: float = 0.0
    loyalty_tier: str = "bronze"  # bronze, silver, gold, platinum
    status: str = "active"  # active, inactive, suspended
    store_id: str  # Which store this customer belongs to
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_order_date: Optional[datetime] = None
    email_verified: bool = False
    phone_verified: bool = False

class CustomerSignup(BaseModel):
    """Customer signup request model"""
    name: str
    email: EmailStr
    phone: str
    password: str
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    store_slug: str  # The store they're signing up for

class CustomerLogin(BaseModel):
    """Customer login request model"""
    email: EmailStr
    password: str
    store_slug: str  # The store they're logging into

class CustomerProfile(BaseModel):
    """Customer profile response model (no sensitive data)"""
    id: str
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    total_orders: int
    total_spent: float
    loyalty_tier: str
    status: str
    created_at: datetime
    last_order_date: Optional[datetime] = None

class CustomerUpdateProfile(BaseModel):
    """Customer profile update model"""
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None

class CustomerAuthResponse(BaseModel):
    """Customer authentication response"""
    success: bool
    message: str
    customer: Optional[CustomerProfile] = None
    token: Optional[str] = None
