from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    total_orders: int = 0
    total_spent: float = 0.0
    average_order_value: float = 0.0
    loyalty_tier: str = "bronze"  # bronze, silver, gold, platinum
    status: str = "active"  # active, inactive
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_order_date: Optional[datetime] = None

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: Optional[str] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    loyalty_tier: Optional[str] = None
    status: Optional[str] = None