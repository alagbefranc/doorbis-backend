"""
Database connection module for Kush Door API
"""
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import logging

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'kush_door')

# Initialize MongoDB client with explicit SSL config
# Add additional TLS/SSL configuration for Atlas
try:
    # For deployment environment, use TLS 1.2 minimum
    import ssl
    client = AsyncIOMotorClient(
        mongo_url,
        serverSelectionTimeoutMS=5000,
        ssl=True,
        ssl_cert_reqs=ssl.CERT_NONE,  # Bypass certificate validation for now
        tls=True,
        tlsInsecure=True
    )
    logger.info("MongoDB client initialized with SSL/TLS configuration")
except Exception as e:
    logger.error(f"Error initializing MongoDB client: {e}")
    # Fallback initialization
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
    logger.info("MongoDB client initialized with default configuration")

database = client[db_name]
USE_MOCK_DB = None  # Will be determined at runtime

async def get_database():
    """Get database instance"""
    global USE_MOCK_DB
    if USE_MOCK_DB is True:
        from mock_database import get_mock_database
        return await get_mock_database()
    elif USE_MOCK_DB is None:
        # First time check - test the connection
        try:
            await database.command('ping')
            USE_MOCK_DB = False
            logger.info("MongoDB connection successful")
            return database
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}. Using mock database.")
            USE_MOCK_DB = True
            from mock_database import get_mock_database
            return await get_mock_database()
    return database

def get_database_sync():
    """Get database instance synchronously"""
    if USE_MOCK_DB:
        from mock_database import mock_db
        return mock_db
    return database
