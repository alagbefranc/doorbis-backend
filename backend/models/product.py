from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # Flower, Edibles, Pre-Rolls, Concentrates, Accessories
    strain: str  # Indica, Sativa, Hybrid, N/A
    thc_percentage: str
    cbd_percentage: str
    price: float
    stock: int
    description: Optional[str] = None
    image_emoji: str = "🌿"
    status: str = "active"  # active, inactive, out-of-stock
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    category: str
    strain: str
    thc_percentage: str
    cbd_percentage: str
    price: float
    stock: int
    description: Optional[str] = None
    image_emoji: str = "🌿"

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    strain: Optional[str] = None
    thc_percentage: Optional[str] = None
    cbd_percentage: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    image_emoji: Optional[str] = None
    status: Optional[str] = None