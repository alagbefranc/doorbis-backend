from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    hashed_password: str
    full_name: str
    store_name: str
    phone: str
    address: str
    license_number: str
    subdomain: str
    is_active: bool = True
    role: str = "admin"  # admin, manager, support, viewer
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    store_name: str
    phone: str
    address: str
    license_number: str
    subdomain: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    store_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    license_number: Optional[str] = None
    subdomain: Optional[str] = None

class UserInDB(User):
    pass

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None