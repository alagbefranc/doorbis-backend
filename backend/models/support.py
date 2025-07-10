from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class SupportTicket(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_email: str
    subject: str
    description: str
    priority: str = "medium"  # low, medium, high
    status: str = "open"  # open, in-progress, resolved, closed
    category: str = "general"  # delivery, product, payment, technical, order
    assigned_to: Optional[str] = None
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SupportTicketCreate(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str
    priority: str = "medium"
    category: str = "general"

class SupportTicketUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None

class KnowledgeBase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str  # Orders, Payment, Delivery, Products
    views: int = 0
    helpful_count: int = 0
    total_ratings: int = 0
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class KnowledgeBaseCreate(BaseModel):
    title: str
    content: str
    category: str

class KnowledgeBaseUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None