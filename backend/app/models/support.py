"""
Support models for ticket management and chat functionality
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in-progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketCategory(str, enum.Enum):
    DELIVERY = "delivery"
    PRODUCT = "product"
    PAYMENT = "payment"
    TECHNICAL = "technical"
    ORDER = "order"
    GENERAL = "general"


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String(20), unique=True, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    category = Column(Enum(TicketCategory), default=TicketCategory.GENERAL)
    
    # Customer info
    customer_name = Column(String(100))
    customer_email = Column(String(100))
    customer_phone = Column(String(20))
    
    # Assignment
    assigned_to = Column(String(100))
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True))
    
    # Related order (if applicable)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    order = relationship("Order", back_populates="support_tickets")
    
    # Responses
    responses = relationship("TicketResponse", back_populates="ticket", cascade="all, delete-orphan")


class TicketResponse(Base):
    __tablename__ = "ticket_responses"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id"), nullable=False)
    responder_name = Column(String(100), nullable=False)
    responder_type = Column(String(20), default="staff")  # staff, customer, system
    message = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False)  # Internal notes vs customer-facing
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    ticket = relationship("SupportTicket", back_populates="responses")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True)
    customer_name = Column(String(100))
    customer_email = Column(String(100))
    status = Column(String(20), default="active")  # active, ended, waiting
    agent_name = Column(String(100))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True))
    
    # Messages
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    sender_name = Column(String(100), nullable=False)
    sender_type = Column(String(20), nullable=False)  # customer, agent, system
    message = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    session = relationship("ChatSession", back_populates="messages")
