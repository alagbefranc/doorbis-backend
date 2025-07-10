import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from dotenv import load_dotenv

# Import all route modules
from routes.auth import router as auth_router
from routes.products import router as products_router
from routes.orders import router as orders_router
from routes.customers import router as customers_router
from routes.drivers import router as drivers_router
from routes.payments import router as payments_router
from routes.support import router as support_router
from routes.analytics import router as analytics_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'kush_door')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app
app = FastAPI(
    title="Kush Door API",
    description="Cannabis Commerce SaaS Platform API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
async def get_database():
    return db

# Import all route modules
import routes.auth
import routes.products
import routes.orders
import routes.customers
import routes.drivers
import routes.payments
import routes.support
import routes.analytics

# Monkey patch the get_database function in each module
routes.auth.get_database = get_database
routes.products.get_database = get_database
routes.orders.get_database = get_database
routes.customers.get_database = get_database
routes.drivers.get_database = get_database
routes.payments.get_database = get_database
routes.support.get_database = get_database
routes.analytics.get_database = get_database

# Update auth dependency as well
import auth.auth
auth.auth.get_database = get_database

# Include all routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(drivers_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(support_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")

# Health check endpoint
@app.get("/api/")
async def root():
    return {"message": "Kush Door API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "message": "All systems operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Kush Door API server...")
    logger.info(f"Connected to MongoDB: {mongo_url}")
    logger.info(f"Database: {db_name}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Kush Door API server...")
    client.close()
