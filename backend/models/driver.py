from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Driver(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    vehicle: str
    license_number: str
    service_area: str
    status: str = "offline"  # active, on-delivery, offline
    total_orders: int = 0
    rating: float = 5.0
    total_earnings: float = 0.0
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: Optional[datetime] = None

class DriverCreate(BaseModel):
    name: str
    email: str
    phone: str
    vehicle: str
    license_number: str
    service_area: str

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    vehicle: Optional[str] = None
    license_number: Optional[str] = None
    service_area: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[float] = None