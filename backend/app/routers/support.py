"""
Support API endpoints for ticket management and chat functionality
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from app.database import get_db
from app.models.support import SupportTicket, TicketResponse, ChatSession, ChatMessage, TicketStatus, TicketPriority
from app.schemas.support import (
    SupportTicket as SupportTicketSchema,
    TicketCreate,
    TicketUpdate,
    TicketResponseCreate,
    ChatSession as ChatSessionSchema,
    ChatSessionCreate,
    ChatMessageCreate,
    SupportStats,
    ChatStats
)
from app.core.auth import get_current_user
from app.models.user import User
from typing import List
from datetime import datetime, timedelta
import uuid

router = APIRouter(
    prefix="/api/support",
    tags=["support"],
    responses={404: {"description": "Not found"}},
)


@router.get("/stats/overview", response_model=SupportStats)
async def get_support_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get support statistics overview"""
    try:
        # Basic ticket counts
        total_tickets = db.query(SupportTicket).count()
        open_tickets = db.query(SupportTicket).filter(SupportTicket.status == TicketStatus.OPEN).count()
        in_progress_tickets = db.query(SupportTicket).filter(SupportTicket.status == TicketStatus.IN_PROGRESS).count()
        resolved_tickets = db.query(SupportTicket).filter(SupportTicket.status == TicketStatus.RESOLVED).count()
        high_priority_tickets = db.query(SupportTicket).filter(
            and_(
                SupportTicket.priority == TicketPriority.HIGH,
                SupportTicket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS])
            )
        ).count()
        
        # Calculate resolution rate
        resolution_rate = (resolved_tickets / total_tickets * 100) if total_tickets > 0 else 100.0
        
        # Mock average response time (in a real system, this would be calculated from response times)
        avg_response_time = 24.5  # minutes
        
        # Mock satisfaction score (would come from customer feedback)
        satisfaction_score = 4.6
        
        return SupportStats(
            open_tickets=open_tickets,
            in_progress_tickets=in_progress_tickets,
            resolved_tickets=resolved_tickets,
            high_priority_tickets=high_priority_tickets,
            avg_response_time_minutes=avg_response_time,
            resolution_rate=resolution_rate,
            satisfaction_score=satisfaction_score,
            total_tickets=total_tickets
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching support stats: {str(e)}")


@router.get("/tickets/", response_model=List[SupportTicketSchema])
async def get_support_tickets(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    priority: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all support tickets"""
    try:
        query = db.query(SupportTicket)
        
        if status:
            query = query.filter(SupportTicket.status == status)
        if priority:
            query = query.filter(SupportTicket.priority == priority)
            
        tickets = query.order_by(desc(SupportTicket.created_at)).offset(skip).limit(limit).all()
        return tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tickets: {str(e)}")


@router.post("/tickets/", response_model=SupportTicketSchema)
async def create_support_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new support ticket"""
    try:
        # Generate unique ticket number
        ticket_number = f"TKT-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        db_ticket = SupportTicket(
            ticket_number=ticket_number,
            **ticket.dict()
        )
        
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        
        return db_ticket
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating ticket: {str(e)}")


@router.get("/tickets/{ticket_id}", response_model=SupportTicketSchema)
async def get_support_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific support ticket"""
    try:
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return ticket
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching ticket: {str(e)}")


@router.put("/tickets/{ticket_id}", response_model=SupportTicketSchema)
async def update_support_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a support ticket"""
    try:
        db_ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not db_ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        # Update fields
        update_data = ticket_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_ticket, field, value)
        
        # Set resolved_at if status changed to resolved
        if ticket_update.status == TicketStatus.RESOLVED and db_ticket.resolved_at is None:
            db_ticket.resolved_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_ticket)
        
        return db_ticket
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating ticket: {str(e)}")


@router.post("/tickets/{ticket_id}/responses")
async def add_ticket_response(
    ticket_id: int,
    response: TicketResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a response to a support ticket"""
    try:
        # Check if ticket exists
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        db_response = TicketResponse(
            ticket_id=ticket_id,
            **response.dict()
        )
        
        db.add(db_response)
        db.commit()
        db.refresh(db_response)
        
        return {"message": "Response added successfully", "response_id": db_response.id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding response: {str(e)}")


@router.get("/chat/stats", response_model=ChatStats)
async def get_chat_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get chat statistics"""
    try:
        active_sessions = db.query(ChatSession).filter(ChatSession.status == "active").count()
        waiting_sessions = db.query(ChatSession).filter(ChatSession.status == "waiting").count()
        
        # Messages today
        today = datetime.now().date()
        total_messages_today = db.query(ChatMessage).filter(
            func.date(ChatMessage.created_at) == today
        ).count()
        
        return ChatStats(
            active_sessions=active_sessions,
            waiting_sessions=waiting_sessions,
            avg_response_time_minutes=2.3,  # Mock data
            total_messages_today=total_messages_today,
            satisfaction_score=4.7  # Mock data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat stats: {str(e)}")


@router.get("/chat/sessions", response_model=List[ChatSessionSchema])
async def get_chat_sessions(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get chat sessions"""
    try:
        query = db.query(ChatSession)
        
        if status:
            query = query.filter(ChatSession.status == status)
            
        sessions = query.order_by(desc(ChatSession.created_at)).offset(skip).limit(limit).all()
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat sessions: {str(e)}")


@router.post("/chat/sessions", response_model=ChatSessionSchema)
async def create_chat_session(
    session: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new chat session"""
    try:
        session_id = f"chat-{uuid.uuid4().hex[:12]}"
        
        db_session = ChatSession(
            session_id=session_id,
            **session.dict()
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return db_session
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating chat session: {str(e)}")


@router.post("/chat/sessions/{session_id}/messages")
async def add_chat_message(
    session_id: int,
    message: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a message to a chat session"""
    try:
        # Check if session exists
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        db_message = ChatMessage(
            session_id=session_id,
            **message.dict()
        )
        
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        return {"message": "Chat message added successfully", "message_id": db_message.id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding chat message: {str(e)}")
