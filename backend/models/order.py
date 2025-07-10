from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    total: float

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    items: List[OrderItem]
    subtotal: float
    tax: float
    delivery_fee: float
    total: float
    status: str = "pending"  # pending, preparing, en-route, delivered, cancelled
    driver_id: Optional[str] = None
    driver_name: Optional[str] = None
    payment_status: str = "pending"  # pending, paid, refunded
    payment_id: Optional[str] = None
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    items: List[OrderItem]
    subtotal: float
    tax: float
    delivery_fee: float
    total: float

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    driver_id: Optional[str] = None
    driver_name: Optional[str] = None
    payment_status: Optional[str] = None
    payment_id: Optional[str] = None