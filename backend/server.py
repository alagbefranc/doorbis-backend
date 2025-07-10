import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from database import get_database, database

# Import all route modules
from routes.auth import router as auth_router
from routes.products import router as products_router
from routes.orders import router as orders_router
from routes.customers import router as customers_router
from routes.drivers import router as drivers_router
from routes.payments import router as payments_router
from routes.support import router as support_router
from routes.analytics import router as analytics_router

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
        db = await get_database()
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
    logger.info("Database connection configured")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Kush Door API server...")
