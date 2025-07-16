from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from database import get_database
from models.support import (
    SupportTicket, SupportTicketCreate, SupportTicketUpdate,
    SupportTicketResponse, SupportTicketResponseCreate,
    ChatSession, ChatSessionCreate, ChatMessage, ChatMessageCreate,
    SupportStats, ChatStats, KnowledgeBase, KnowledgeBaseCreate, KnowledgeBaseUpdate
)
from auth.auth import get_current_active_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/support", tags=["Support"])

# Support Statistics
@router.get("/stats", response_model=SupportStats)
async def get_support_stats(
    current_user: dict = Depends(get_current_active_user)
):
    """Get support statistics overview"""
    db = await get_database()
    user_id = current_user["id"]
    
    # Get ticket statistics
    total_tickets = await db.support_tickets.count_documents({"user_id": user_id})
    open_tickets = await db.support_tickets.count_documents({
        "user_id": user_id,
        "status": "open"
    })
    in_progress = await db.support_tickets.count_documents({
        "user_id": user_id,
        "status": "in-progress"
    })
    resolved_tickets = await db.support_tickets.count_documents({
        "user_id": user_id,
        "status": "resolved"
    })
    high_priority = await db.support_tickets.count_documents({
        "user_id": user_id,
        "priority": "high",
        "status": {"$in": ["open", "in-progress"]}
    })
    
    # Calculate average response time (in hours)
    avg_response_time = 2.5  # Mock value for now
    
    # Calculate resolution rate
    resolution_rate = (resolved_tickets / total_tickets * 100) if total_tickets > 0 else 0
    
    return SupportStats(
        total_tickets=total_tickets,
        open_tickets=open_tickets,
        in_progress=in_progress,
        resolved_tickets=resolved_tickets,
        high_priority=high_priority,
        avg_response_time=avg_response_time,
        resolution_rate=round(resolution_rate, 1)
    )

# Support Tickets
@router.get("/tickets", response_model=List[SupportTicket])
async def get_support_tickets(
    current_user: dict = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all support tickets for the current user"""
    db = await get_database()
    tickets_cursor = db.support_tickets.find(
        {"user_id": current_user["id"]}
    ).skip(skip).limit(limit)
    tickets = await tickets_cursor.to_list(length=limit)
    return [SupportTicket(**ticket) for ticket in tickets]

@router.post("/tickets", response_model=SupportTicket)
async def create_support_ticket(
    ticket_data: SupportTicketCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new support ticket"""
    db = await get_database()
    ticket = SupportTicket(
        user_id=current_user["id"],
        **ticket_data.dict()
    )
    
    ticket_dict = ticket.dict()
    await db.support_tickets.insert_one(ticket_dict)
    
    return ticket

@router.get("/tickets/{ticket_id}", response_model=SupportTicket)
async def get_support_ticket(
    ticket_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific support ticket"""
    db = await get_database()
    ticket = await db.support_tickets.find_one({
        "id": ticket_id,
        "user_id": current_user["id"]
    })
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
    
    return SupportTicket(**ticket)

@router.put("/tickets/{ticket_id}", response_model=SupportTicket)
async def update_support_ticket(
    ticket_id: str,
    ticket_update: SupportTicketUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update a support ticket"""
    db = await get_database()
    # Check if ticket exists and belongs to user
    existing_ticket = await db.support_tickets.find_one({
        "id": ticket_id,
        "user_id": current_user["id"]
    })
    
    if not existing_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
    
    # Update only provided fields
    update_data = ticket_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    if update_data:
        await db.support_tickets.update_one(
            {"id": ticket_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated ticket
    updated_ticket = await db.support_tickets.find_one({
        "id": ticket_id,
        "user_id": current_user["id"]
    })
    
    return SupportTicket(**updated_ticket)

@router.delete("/tickets/{ticket_id}")
async def delete_support_ticket(
    ticket_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Delete a support ticket"""
    db = await get_database()
    result = await db.support_tickets.delete_one({
        "id": ticket_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
    
    return {"message": "Support ticket deleted successfully"}

# Support Ticket Responses
@router.get("/tickets/{ticket_id}/responses", response_model=List[SupportTicketResponse])
async def get_ticket_responses(
    ticket_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get all responses for a support ticket"""
    db = await get_database()
    # First verify the ticket belongs to the user
    ticket = await db.support_tickets.find_one({
        "id": ticket_id,
        "user_id": current_user["id"]
    })
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
    
    responses_cursor = db.ticket_responses.find(
        {"ticket_id": ticket_id}
    ).sort("created_at", 1)
    responses = await responses_cursor.to_list(length=None)
    
    return [SupportTicketResponse(**response) for response in responses]

@router.post("/tickets/{ticket_id}/responses", response_model=SupportTicketResponse)
async def add_ticket_response(
    ticket_id: str,
    response_data: SupportTicketResponseCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Add a response to a support ticket"""
    db = await get_database()
    # First verify the ticket belongs to the user
    ticket = await db.support_tickets.find_one({
        "id": ticket_id,
        "user_id": current_user["id"]
    })
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
    
    response = SupportTicketResponse(
        ticket_id=ticket_id,
        **response_data.dict()
    )
    
    response_dict = response.dict()
    await db.ticket_responses.insert_one(response_dict)
    
    # Update ticket's updated_at timestamp
    await db.support_tickets.update_one(
        {"id": ticket_id, "user_id": current_user["id"]},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    return response

# Chat Sessions
@router.get("/chat/sessions", response_model=List[ChatSession])
async def get_chat_sessions(
    current_user: dict = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 50
):
    """Get all chat sessions for the current user"""
    db = await get_database()
    sessions_cursor = db.chat_sessions.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1).skip(skip).limit(limit)
    sessions = await sessions_cursor.to_list(length=limit)
    
    return [ChatSession(**session) for session in sessions]

@router.post("/chat/sessions", response_model=ChatSession)
async def create_chat_session(
    session_data: ChatSessionCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new chat session"""
    db = await get_database()
    session = ChatSession(
        user_id=current_user["id"],
        **session_data.dict()
    )
    
    session_dict = session.dict()
    await db.chat_sessions.insert_one(session_dict)
    
    return session

@router.get("/chat/sessions/{session_id}", response_model=ChatSession)
async def get_chat_session(
    session_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific chat session"""
    db = await get_database()
    session = await db.chat_sessions.find_one({
        "id": session_id,
        "user_id": current_user["id"]
    })
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    return ChatSession(**session)

# Chat Messages
@router.get("/chat/sessions/{session_id}/messages", response_model=List[ChatMessage])
async def get_chat_messages(
    session_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get all messages for a chat session"""
    db = await get_database()
    # First verify the session belongs to the user
    session = await db.chat_sessions.find_one({
        "id": session_id,
        "user_id": current_user["id"]
    })
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    messages_cursor = db.chat_messages.find(
        {"session_id": session_id}
    ).sort("created_at", 1)
    messages = await messages_cursor.to_list(length=None)
    
    return [ChatMessage(**message) for message in messages]

@router.post("/chat/sessions/{session_id}/messages", response_model=ChatMessage)
async def add_chat_message(
    session_id: str,
    message_data: ChatMessageCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Add a message to a chat session"""
    db = await get_database()
    # First verify the session belongs to the user
    session = await db.chat_sessions.find_one({
        "id": session_id,
        "user_id": current_user["id"]
    })
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    message = ChatMessage(
        session_id=session_id,
        **message_data.dict()
    )
    
    message_dict = message.dict()
    await db.chat_messages.insert_one(message_dict)
    
    # Update session's updated_at timestamp
    await db.chat_sessions.update_one(
        {"id": session_id, "user_id": current_user["id"]},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    return message

# Chat Statistics
@router.get("/chat/stats", response_model=ChatStats)
async def get_chat_stats(
    current_user: dict = Depends(get_current_active_user)
):
    """Get chat statistics"""
    db = await get_database()
    user_id = current_user["id"]
    
    total_sessions = await db.chat_sessions.count_documents({"user_id": user_id})
    active_sessions = await db.chat_sessions.count_documents({
        "user_id": user_id,
        "status": "active"
    })
    
    # Calculate total messages across all user sessions
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$lookup": {
            "from": "chat_messages",
            "localField": "id",
            "foreignField": "session_id",
            "as": "messages"
        }},
        {"$unwind": "$messages"},
        {"$count": "total_messages"}
    ]
    
    result = await db.chat_sessions.aggregate(pipeline).to_list(length=1)
    total_messages = result[0]["total_messages"] if result else 0
    
    # Calculate average session duration (mock for now)
    avg_session_duration = 15.5  # minutes
    
    return ChatStats(
        total_sessions=total_sessions,
        active_sessions=active_sessions,
        total_messages=total_messages,
        avg_session_duration=avg_session_duration
    )
