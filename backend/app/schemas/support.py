"""
Support schemas for ticket management and chat functionality
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.support import TicketPriority, TicketStatus, TicketCategory


# Support Ticket Schemas
class TicketBase(BaseModel):
    subject: str
    description: Optional[str] = None
    priority: TicketPriority = TicketPriority.MEDIUM
    category: TicketCategory = TicketCategory.GENERAL
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    order_id: Optional[int] = None


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    category: Optional[TicketCategory] = None
    assigned_to: Optional[str] = None


class TicketResponseBase(BaseModel):
    responder_name: str
    responder_type: str = "staff"
    message: str
    is_internal: bool = False


class TicketResponseCreate(TicketResponseBase):
    pass


class TicketResponse(TicketResponseBase):
    id: int
    ticket_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SupportTicket(TicketBase):
    id: int
    ticket_number: str
    status: TicketStatus
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    responses: List[TicketResponse] = []

    class Config:
        from_attributes = True


# Chat Schemas
class ChatMessageBase(BaseModel):
    sender_name: str
    sender_type: str
    message: str


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessage(ChatMessageBase):
    id: int
    session_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ChatSessionBase(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    agent_name: Optional[str] = None


class ChatSessionCreate(ChatSessionBase):
    pass


class ChatSessionUpdate(BaseModel):
    status: Optional[str] = None
    agent_name: Optional[str] = None


class ChatSession(ChatSessionBase):
    id: int
    session_id: str
    status: str
    created_at: datetime
    ended_at: Optional[datetime] = None
    messages: List[ChatMessage] = []

    class Config:
        from_attributes = True


# Stats Schemas
class SupportStats(BaseModel):
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    high_priority_tickets: int
    avg_response_time_minutes: float
    resolution_rate: float
    satisfaction_score: float
    total_tickets: int


class ChatStats(BaseModel):
    active_sessions: int
    waiting_sessions: int
    avg_response_time_minutes: float
    total_messages_today: int
    satisfaction_score: float
