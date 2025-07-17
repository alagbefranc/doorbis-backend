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
from routes.customer_auth import router as customer_auth_router
from routes.drivers import router as drivers_router
from routes.payments import router as payments_router
from routes.support import router as support_router
from routes.analytics import router as analytics_router
from routes.storefront import router as storefront_router

# Create the main app
app = FastAPI(
    title="Kush Door API",
    description="Cannabis Commerce SaaS Platform API",
    version="1.0.0"
)

# CORS middleware
origins = [
    "https://doorbis.netlify.app",
    "http://doorbis.netlify.app", 
    "http://localhost:3000",
    "http://localhost:8000"
    # Removed wildcard origin as it can cause issues with credentials
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    expose_headers=["Content-Length", "X-Total-Count"],
    max_age=600,
)

# Include all routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(customer_auth_router, prefix="/api")
app.include_router(drivers_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(support_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(storefront_router, prefix="/api")

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
    try:
        # Test MongoDB connection
        db = await get_database()
        await db.command('ping')
        logger.info("Successfully connected to MongoDB")
    except Exception as e:
        logger.warning(f"MongoDB connection failed during startup: {e}. Using mock database.")
        # Update the database module to use mock
        import database
        database.USE_MOCK_DB = True
    logger.info("Database connection configured")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Kush Door API server...")

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
