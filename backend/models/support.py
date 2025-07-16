from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in-progress" 
    resolved = "resolved"
    closed = "closed"

class TicketPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class ChatStatus(str, Enum):
    active = "active"
    ended = "ended"
    waiting = "waiting"

class MessageSender(str, Enum):
    user = "user"
    support = "support"
    system = "system"

# Support Ticket Models
class SupportTicket(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    priority: str = "medium"  # low, medium, high, urgent
    status: str = "open"  # open, in-progress, resolved, closed
    category: Optional[str] = Field(None, max_length=100)
    user_id: str  # Store owner
    assigned_to: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SupportTicketCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    priority: str = "medium"
    category: Optional[str] = Field(None, max_length=100)

class SupportTicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = None
    assigned_to: Optional[str] = None

# Support Ticket Response Models
class SupportTicketResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ticket_id: str
    message: str = Field(..., min_length=1)
    sender: str = "user"  # user, support, system
    sender_name: Optional[str] = None
    is_internal: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SupportTicketResponseCreate(BaseModel):
    message: str = Field(..., min_length=1)
    sender: str = "user"
    sender_name: Optional[str] = None
    is_internal: bool = False

# Chat Session Models
class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: Optional[str] = Field(None, max_length=200)
    status: str = "active"  # active, ended, waiting
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ChatSessionCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)

# Chat Message Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str = Field(..., min_length=1)
    sender: str = "user"  # user, support, system
    sender_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ChatMessageCreate(BaseModel):
    message: str = Field(..., min_length=1)
    sender: str = "user"
    sender_name: Optional[str] = None

# Statistics Models
class SupportStats(BaseModel):
    total_tickets: int = 0
    open_tickets: int = 0
    in_progress: int = 0
    resolved_tickets: int = 0
    high_priority: int = 0
    avg_response_time: float = 0.0  # in hours
    resolution_rate: float = 0.0  # percentage

class ChatStats(BaseModel):
    total_sessions: int = 0
    active_sessions: int = 0
    total_messages: int = 0
    avg_session_duration: float = 0.0  # in minutes

# Legacy Knowledge Base Models (keeping for compatibility)
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
