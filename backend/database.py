"""
Database connection module for Kush Door API
"""
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'kush_door')
client = AsyncIOMotorClient(mongo_url)
database = client[db_name]

async def get_database():
    """Get database instance"""
    return database

def get_database_sync():
    """Get database instance synchronously"""
    return database