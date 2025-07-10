#!/usr/bin/env python3
"""
Script to create sample data for Kush Door cannabis commerce platform
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from motor.motor_asyncio import AsyncIOMotorClient
from auth.auth import get_password_hash
from models.user import User
from models.product import Product
from models.order import Order, OrderItem
from models.customer import Customer
from models.driver import Driver
from models.payment import Payment
from models.support import SupportTicket, KnowledgeBase
from datetime import datetime, timedelta
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv(backend_dir / '.env')

async def create_sample_data():
    """Create comprehensive sample data for the cannabis commerce platform"""
    
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'kush_door')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌿 Creating sample data for Kush Door platform...")
    
    # Create sample user (dispensary owner)
    user_data = {
        "id": "user_001",
        "email": "owner@greenvalley.com",
        "hashed_password": get_password_hash("password123"),
        "full_name": "John Doe",
        "store_name": "Green Valley Dispensary",
        "phone": "(555) 123-4567",
        "address": "123 Main Street, Los Angeles, CA 90210",
        "license_number": "C11-0000123-LIC",
        "subdomain": "green-valley",
        "is_active": True,
        "role": "admin",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    user = User(**user_data)
    await db.users.insert_one(user.dict())
    print(f"✅ Created user: {user.email}")
    
    # Create sample products
    products_data = [
        {
            "id": "prod_001",
            "name": "Blue Dream",
            "category": "Flower",
            "strain": "Hybrid",
            "thc_percentage": "18-24%",
            "cbd_percentage": "0.1%",
            "price": 45.00,
            "stock": 25,
            "description": "A balanced hybrid with sweet berry aroma and cerebral high.",
            "image_emoji": "💙",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "prod_002",
            "name": "OG Kush",
            "category": "Flower",
            "strain": "Indica",
            "thc_percentage": "20-25%",
            "cbd_percentage": "0.05%",
            "price": 50.00,
            "stock": 18,
            "description": "Classic indica with earthy, pine, and woody undertones.",
            "image_emoji": "🌲",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "prod_003",
            "name": "Sour Diesel",
            "category": "Flower",
            "strain": "Sativa",
            "thc_percentage": "19-23%",
            "cbd_percentage": "0.2%",
            "price": 48.00,
            "stock": 30,
            "description": "Energizing sativa with diesel-like aroma and uplifting effects.",
            "image_emoji": "⚡",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "prod_004",
            "name": "CBD Gummies",
            "category": "Edibles",
            "strain": "N/A",
            "thc_percentage": "2%",
            "cbd_percentage": "25%",
            "price": 25.00,
            "stock": 45,
            "description": "Delicious fruit gummies with high CBD content for relaxation.",
            "image_emoji": "🍯",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "prod_005",
            "name": "Pre-Roll Pack",
            "category": "Pre-Rolls",
            "strain": "Hybrid",
            "thc_percentage": "20%",
            "cbd_percentage": "0.1%",
            "price": 35.00,
            "stock": 12,
            "description": "Pack of 5 pre-rolled joints with premium flower blend.",
            "image_emoji": "🚬",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "prod_006",
            "name": "Live Rosin",
            "category": "Concentrates",
            "strain": "Hybrid",
            "thc_percentage": "75%",
            "cbd_percentage": "0.3%",
            "price": 80.00,
            "stock": 8,
            "description": "Premium live rosin extract with full terpene profile.",
            "image_emoji": "💎",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    for product_data in products_data:
        product = Product(**product_data)
        await db.products.insert_one(product.dict())
    print(f"✅ Created {len(products_data)} products")
    
    # Create sample customers
    customers_data = [
        {
            "id": "cust_001",
            "name": "Sarah Johnson",
            "email": "sarah@email.com",
            "phone": "(555) 123-4567",
            "address": "456 Oak Ave, Los Angeles, CA 90210",
            "total_orders": 18,
            "total_spent": 2345.50,
            "average_order_value": 130.31,
            "loyalty_tier": "gold",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=120),
            "updated_at": datetime.utcnow(),
            "last_order_date": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "id": "cust_002",
            "name": "Mike Chen",
            "email": "mike@email.com",
            "phone": "(555) 234-5678",
            "address": "789 Pine St, Los Angeles, CA 90210",
            "total_orders": 45,
            "total_spent": 5678.25,
            "average_order_value": 126.18,
            "loyalty_tier": "platinum",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=300),
            "updated_at": datetime.utcnow(),
            "last_order_date": datetime.utcnow() - timedelta(minutes=45)
        },
        {
            "id": "cust_003",
            "name": "Emma Wilson",
            "email": "emma@email.com",
            "phone": "(555) 345-6789",
            "address": "321 Elm Dr, Los Angeles, CA 90210",
            "total_orders": 12,
            "total_spent": 1567.75,
            "average_order_value": 130.65,
            "loyalty_tier": "silver",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=90),
            "updated_at": datetime.utcnow(),
            "last_order_date": datetime.utcnow() - timedelta(minutes=30)
        },
        {
            "id": "cust_004",
            "name": "David Brown",
            "email": "david@email.com",
            "phone": "(555) 456-7890",
            "address": "654 Maple Ln, Los Angeles, CA 90210",
            "total_orders": 8,
            "total_spent": 945.50,
            "average_order_value": 118.19,
            "loyalty_tier": "bronze",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=60),
            "updated_at": datetime.utcnow(),
            "last_order_date": datetime.utcnow() - timedelta(days=7)
        },
        {
            "id": "cust_005",
            "name": "Jessica Taylor",
            "email": "jessica@email.com",
            "phone": "(555) 567-8901",
            "address": "987 Cedar Blvd, Los Angeles, CA 90210",
            "total_orders": 22,
            "total_spent": 3234.75,
            "average_order_value": 147.03,
            "loyalty_tier": "gold",
            "status": "active",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=150),
            "updated_at": datetime.utcnow(),
            "last_order_date": datetime.utcnow() - timedelta(days=3)
        }
    ]
    
    for customer_data in customers_data:
        customer = Customer(**customer_data)
        await db.customers.insert_one(customer.dict())
    print(f"✅ Created {len(customers_data)} customers")
    
    # Create sample drivers
    drivers_data = [
        {
            "id": "drv_001",
            "name": "Alex Rodriguez",
            "email": "alex.driver@email.com",
            "phone": "(555) 111-2222",
            "vehicle": "Toyota Prius 2020",
            "license_number": "DL123456789",
            "service_area": "West LA",
            "status": "active",
            "total_orders": 156,
            "rating": 4.8,
            "total_earnings": 2340.50,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=180),
            "updated_at": datetime.utcnow(),
            "last_active": datetime.utcnow() - timedelta(minutes=15)
        },
        {
            "id": "drv_002",
            "name": "Maria Santos",
            "email": "maria.driver@email.com",
            "phone": "(555) 333-4444",
            "vehicle": "Honda Civic 2019",
            "license_number": "DL987654321",
            "service_area": "East LA",
            "status": "on-delivery",
            "total_orders": 203,
            "rating": 4.9,
            "total_earnings": 3456.75,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=220),
            "updated_at": datetime.utcnow(),
            "last_active": datetime.utcnow() - timedelta(minutes=5)
        },
        {
            "id": "drv_003",
            "name": "James Kim",
            "email": "james.driver@email.com",
            "phone": "(555) 555-6666",
            "vehicle": "Tesla Model 3 2021",
            "license_number": "DL456789123",
            "service_area": "Downtown LA",
            "status": "offline",
            "total_orders": 89,
            "rating": 4.6,
            "total_earnings": 1567.25,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=90),
            "updated_at": datetime.utcnow(),
            "last_active": datetime.utcnow() - timedelta(hours=8)
        }
    ]
    
    for driver_data in drivers_data:
        driver = Driver(**driver_data)
        await db.drivers.insert_one(driver.dict())
    print(f"✅ Created {len(drivers_data)} drivers")
    
    # Create sample orders
    orders_data = [
        {
            "id": "ord_001",
            "customer_name": "Sarah Johnson",
            "customer_email": "sarah@email.com",
            "customer_phone": "(555) 123-4567",
            "delivery_address": "456 Oak Ave, Los Angeles, CA 90210",
            "items": [
                {
                    "product_id": "prod_001",
                    "product_name": "Blue Dream",
                    "quantity": 2,
                    "price": 45.00,
                    "total": 90.00
                },
                {
                    "product_id": "prod_004",
                    "product_name": "CBD Gummies",
                    "quantity": 1,
                    "price": 25.00,
                    "total": 25.00
                }
            ],
            "subtotal": 115.00,
            "tax": 10.35,
            "delivery_fee": 5.00,
            "total": 130.35,
            "status": "delivered",
            "driver_id": "drv_001",
            "driver_name": "Alex Rodriguez",
            "payment_status": "paid",
            "payment_id": "pay_001",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(hours=2),
            "updated_at": datetime.utcnow() - timedelta(hours=1)
        },
        {
            "id": "ord_002",
            "customer_name": "Mike Chen",
            "customer_email": "mike@email.com",
            "customer_phone": "(555) 234-5678",
            "delivery_address": "789 Pine St, Los Angeles, CA 90210",
            "items": [
                {
                    "product_id": "prod_002",
                    "product_name": "OG Kush",
                    "quantity": 1,
                    "price": 50.00,
                    "total": 50.00
                },
                {
                    "product_id": "prod_005",
                    "product_name": "Pre-Roll Pack",
                    "quantity": 1,
                    "price": 35.00,
                    "total": 35.00
                }
            ],
            "subtotal": 85.00,
            "tax": 7.65,
            "delivery_fee": 5.00,
            "total": 97.65,
            "status": "en-route",
            "driver_id": "drv_002",
            "driver_name": "Maria Santos",
            "payment_status": "paid",
            "payment_id": "pay_002",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(minutes=45),
            "updated_at": datetime.utcnow() - timedelta(minutes=30)
        },
        {
            "id": "ord_003",
            "customer_name": "Emma Wilson",
            "customer_email": "emma@email.com",
            "customer_phone": "(555) 345-6789",
            "delivery_address": "321 Elm Dr, Los Angeles, CA 90210",
            "items": [
                {
                    "product_id": "prod_003",
                    "product_name": "Sour Diesel",
                    "quantity": 3,
                    "price": 48.00,
                    "total": 144.00
                }
            ],
            "subtotal": 144.00,
            "tax": 12.96,
            "delivery_fee": 5.00,
            "total": 161.96,
            "status": "preparing",
            "driver_id": None,
            "driver_name": None,
            "payment_status": "paid",
            "payment_id": "pay_003",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(minutes=30),
            "updated_at": datetime.utcnow() - timedelta(minutes=25)
        },
        {
            "id": "ord_004",
            "customer_name": "David Brown",
            "customer_email": "david@email.com",
            "customer_phone": "(555) 456-7890",
            "delivery_address": "654 Maple Ln, Los Angeles, CA 90210",
            "items": [
                {
                    "product_id": "prod_006",
                    "product_name": "Live Rosin",
                    "quantity": 1,
                    "price": 80.00,
                    "total": 80.00
                },
                {
                    "product_id": "prod_001",
                    "product_name": "Blue Dream",
                    "quantity": 3,
                    "price": 45.00,
                    "total": 135.00
                }
            ],
            "subtotal": 215.00,
            "tax": 19.35,
            "delivery_fee": 5.00,
            "total": 239.35,
            "status": "pending",
            "driver_id": None,
            "driver_name": None,
            "payment_status": "paid",
            "payment_id": "pay_004",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(minutes=15),
            "updated_at": datetime.utcnow() - timedelta(minutes=15)
        }
    ]
    
    for order_data in orders_data:
        order = Order(**order_data)
        await db.orders.insert_one(order.dict())
    print(f"✅ Created {len(orders_data)} orders")
    
    # Create sample payments
    payments_data = [
        {
            "id": "pay_001",
            "order_id": "ord_001",
            "customer_name": "Sarah Johnson",
            "amount": 130.35,
            "fee": 3.91,
            "net_amount": 126.44,
            "status": "completed",
            "payment_method": "card",
            "stripe_payment_intent_id": "pi_1234567890",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(hours=2),
            "updated_at": datetime.utcnow() - timedelta(hours=1)
        },
        {
            "id": "pay_002",
            "order_id": "ord_002",
            "customer_name": "Mike Chen",
            "amount": 97.65,
            "fee": 2.93,
            "net_amount": 94.72,
            "status": "completed",
            "payment_method": "card",
            "stripe_payment_intent_id": "pi_1234567891",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(minutes=45),
            "updated_at": datetime.utcnow() - timedelta(minutes=30)
        },
        {
            "id": "pay_003",
            "order_id": "ord_003",
            "customer_name": "Emma Wilson",
            "amount": 161.96,
            "fee": 4.86,
            "net_amount": 157.10,
            "status": "completed",
            "payment_method": "card",
            "stripe_payment_intent_id": "pi_1234567892",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(minutes=30),
            "updated_at": datetime.utcnow() - timedelta(minutes=25)
        },
        {
            "id": "pay_004",
            "order_id": "ord_004",
            "customer_name": "David Brown",
            "amount": 239.35,
            "fee": 7.18,
            "net_amount": 232.17,
            "status": "completed",
            "payment_method": "card",
            "stripe_payment_intent_id": "pi_1234567893",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(minutes=15),
            "updated_at": datetime.utcnow() - timedelta(minutes=15)
        }
    ]
    
    for payment_data in payments_data:
        payment = Payment(**payment_data)
        await db.payments.insert_one(payment.dict())
    print(f"✅ Created {len(payments_data)} payments")
    
    # Create sample support tickets
    tickets_data = [
        {
            "id": "tkt_001",
            "customer_name": "Sarah Johnson",
            "customer_email": "sarah@email.com",
            "subject": "Order delivery delay",
            "description": "My order was supposed to arrive 30 minutes ago. Can you please check the status?",
            "priority": "high",
            "status": "open",
            "category": "delivery",
            "assigned_to": "John Doe",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(hours=2),
            "updated_at": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "id": "tkt_002",
            "customer_name": "Mike Chen",
            "customer_email": "mike@email.com",
            "subject": "Product quality issue",
            "description": "The Blue Dream I received seems different from what I ordered before. Lower quality.",
            "priority": "medium",
            "status": "in-progress",
            "category": "product",
            "assigned_to": "Jane Smith",
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(hours=4),
            "updated_at": datetime.utcnow() - timedelta(hours=1)
        },
        {
            "id": "tkt_003",
            "customer_name": "Emma Wilson",
            "customer_email": "emma@email.com",
            "subject": "Payment refund request",
            "description": "I need to cancel my order and get a refund. Changed my mind.",
            "priority": "high",
            "status": "open",
            "category": "payment",
            "assigned_to": None,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(hours=1),
            "updated_at": datetime.utcnow() - timedelta(hours=1)
        }
    ]
    
    for ticket_data in tickets_data:
        ticket = SupportTicket(**ticket_data)
        await db.support_tickets.insert_one(ticket.dict())
    print(f"✅ Created {len(tickets_data)} support tickets")
    
    # Create sample knowledge base articles
    kb_articles_data = [
        {
            "id": "kb_001",
            "title": "How to track your order",
            "content": "You can track your order status by logging into your account and visiting the Orders section. You'll see real-time updates on preparation, dispatch, and delivery.",
            "category": "Orders",
            "views": 1245,
            "helpful_count": 1109,
            "total_ratings": 1245,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": datetime.utcnow() - timedelta(days=10)
        },
        {
            "id": "kb_002",
            "title": "Payment methods accepted",
            "content": "We accept all major credit cards, debit cards, Apple Pay, and Google Pay. Cash payments are available for delivery orders.",
            "category": "Payment",
            "views": 892,
            "helpful_count": 678,
            "total_ratings": 892,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=25),
            "updated_at": datetime.utcnow() - timedelta(days=5)
        },
        {
            "id": "kb_003",
            "title": "Delivery time estimates",
            "content": "Standard delivery takes 30-60 minutes. Express delivery (additional fee) takes 15-30 minutes. Times may vary during peak hours.",
            "category": "Delivery",
            "views": 1034,
            "helpful_count": 951,
            "total_ratings": 1034,
            "user_id": user.id,
            "created_at": datetime.utcnow() - timedelta(days=20),
            "updated_at": datetime.utcnow() - timedelta(days=3)
        }
    ]
    
    for article_data in kb_articles_data:
        article = KnowledgeBase(**article_data)
        await db.knowledge_base.insert_one(article.dict())
    print(f"✅ Created {len(kb_articles_data)} knowledge base articles")
    
    print("\n🎉 Sample data creation completed!")
    print(f"""
📊 Created:
- 1 user (dispensary owner)
- {len(products_data)} products
- {len(customers_data)} customers  
- {len(drivers_data)} drivers
- {len(orders_data)} orders
- {len(payments_data)} payments
- {len(tickets_data)} support tickets
- {len(kb_articles_data)} knowledge base articles

🔑 Login credentials:
Email: owner@greenvalley.com
Password: password123

🚀 You can now test the full platform with live data!
    """)
    
    # Close the database connection
    client.close()

if __name__ == "__main__":
    asyncio.run(create_sample_data())