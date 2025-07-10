from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    customer_name: str
    amount: float
    fee: float
    net_amount: float
    status: str = "pending"  # pending, completed, failed, refunded
    payment_method: str = "card"  # card, cash, digital_wallet
    stripe_payment_intent_id: Optional[str] = None
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentCreate(BaseModel):
    order_id: str
    customer_name: str
    amount: float
    fee: float
    net_amount: float
    payment_method: str = "card"
    stripe_payment_intent_id: Optional[str] = None

class PaymentUpdate(BaseModel):
    status: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None

class Payout(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    amount: float
    fee: float
    net_amount: float
    transaction_count: int
    status: str = "pending"  # pending, paid, failed
    bank_account: str
    user_id: str  # Store owner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)