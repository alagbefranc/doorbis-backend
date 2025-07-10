from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from models.support import SupportTicket, SupportTicketCreate, SupportTicketUpdate, KnowledgeBase, KnowledgeBaseCreate, KnowledgeBaseUpdate
from auth.auth import get_current_active_user
from database import get_database

router = APIRouter(prefix="/support", tags=["Support"])

# Support Tickets
@router.get("/tickets", response_model=List[SupportTicket])
async def get_support_tickets(
    current_user: dict = Depends(get_current_active_user)
):
    """Get all support tickets for the current user's store"""
    db = await get_database()
    tickets = await db.support_tickets.find({"user_id": current_user["id"]}).to_list(1000)
    return [SupportTicket(**ticket) for ticket in tickets]

@router.post("/tickets", response_model=SupportTicket)
async def create_support_ticket(
    ticket_data: SupportTicketCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new support ticket"""
    db = await get_database()
    ticket_dict = ticket_data.dict()
    ticket_dict["user_id"] = current_user["id"]
    
    new_ticket = SupportTicket(**ticket_dict)
    await db.support_tickets.insert_one(new_ticket.dict())
    
    return new_ticket

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

@router.get("/tickets/stats/overview")
async def get_support_stats(
    current_user: dict = Depends(get_current_active_user)
):
    """Get support statistics overview"""
    db = await get_database()
    total_tickets = await db.support_tickets.count_documents({"user_id": current_user["id"]})
    open_tickets = await db.support_tickets.count_documents({
        "user_id": current_user["id"],
        "status": "open"
    })
    in_progress = await db.support_tickets.count_documents({
        "user_id": current_user["id"],
        "status": "in-progress"
    })
    resolved_tickets = await db.support_tickets.count_documents({
        "user_id": current_user["id"],
        "status": "resolved"
    })
    high_priority = await db.support_tickets.count_documents({
        "user_id": current_user["id"],
        "priority": "high",
        "status": {"$in": ["open", "in-progress"]}
    })
    
    resolution_rate = (resolved_tickets / total_tickets * 100) if total_tickets > 0 else 0
    
    return {
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "in_progress": in_progress,
        "resolved_tickets": resolved_tickets,
        "high_priority": high_priority,
        "resolution_rate": round(resolution_rate, 1)
    }

# Knowledge Base
@router.get("/knowledge-base", response_model=List[KnowledgeBase])
async def get_knowledge_base_articles(
    current_user: dict = Depends(get_current_active_user)
):
    """Get all knowledge base articles for the current user's store"""
    db = await get_database()
    articles = await db.knowledge_base.find({"user_id": current_user["id"]}).to_list(1000)
    return [KnowledgeBase(**article) for article in articles]

@router.post("/knowledge-base", response_model=KnowledgeBase)
async def create_knowledge_base_article(
    article_data: KnowledgeBaseCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create a new knowledge base article"""
    db = await get_database()
    article_dict = article_data.dict()
    article_dict["user_id"] = current_user["id"]
    
    new_article = KnowledgeBase(**article_dict)
    await db.knowledge_base.insert_one(new_article.dict())
    
    return new_article

@router.get("/knowledge-base/{article_id}", response_model=KnowledgeBase)
async def get_knowledge_base_article(
    article_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a specific knowledge base article"""
    db = await get_database()
    article = await db.knowledge_base.find_one({
        "id": article_id,
        "user_id": current_user["id"]
    })
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base article not found"
        )
    
    # Increment view count
    await db.knowledge_base.update_one(
        {"id": article_id, "user_id": current_user["id"]},
        {"$inc": {"views": 1}}
    )
    
    return KnowledgeBase(**article)

@router.put("/knowledge-base/{article_id}", response_model=KnowledgeBase)
async def update_knowledge_base_article(
    article_id: str,
    article_update: KnowledgeBaseUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update a knowledge base article"""
    db = await get_database()
    # Check if article exists and belongs to user
    existing_article = await db.knowledge_base.find_one({
        "id": article_id,
        "user_id": current_user["id"]
    })
    
    if not existing_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base article not found"
        )
    
    # Update only provided fields
    update_data = article_update.dict(exclude_unset=True)
    if update_data:
        await db.knowledge_base.update_one(
            {"id": article_id, "user_id": current_user["id"]},
            {"$set": update_data}
        )
    
    # Return updated article
    updated_article = await db.knowledge_base.find_one({
        {"id": article_id, "user_id": current_user["id"]
    })
    
    return KnowledgeBase(**updated_article)

@router.delete("/knowledge-base/{article_id}")
async def delete_knowledge_base_article(
    article_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Delete a knowledge base article"""
    db = await get_database()
    result = await db.knowledge_base.delete_one({
        "id": article_id,
        "user_id": current_user["id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base article not found"
        )
    
    return {"message": "Knowledge base article deleted successfully"}

@router.post("/knowledge-base/{article_id}/helpful")
async def mark_article_helpful(
    article_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Mark an article as helpful"""
    db = await get_database()
    result = await db.knowledge_base.update_one(
        {"id": article_id, "user_id": current_user["id"]},
        {
            "$inc": {
                "helpful_count": 1,
                "total_ratings": 1
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base article not found"
        )
    
    return {"message": "Article marked as helpful"}