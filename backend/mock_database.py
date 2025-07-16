"""
Mock database implementation for testing without MongoDB
"""
from passlib.context import CryptContext
from datetime import datetime
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock in-memory data
mock_users = [
    {
        "id": "user_001",
        "email": "owner@greenvalley.com",
        "hashed_password": pwd_context.hash("password123"),
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
]

mock_products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Blue Dream",
        "category": "Flower",
        "strain": "Hybrid",
        "thc_percentage": "18-24%",
        "cbd_percentage": "0.1%",
        "price": 45.00,
        "stock": 25,
        "description": "A balanced hybrid with sweet berry aroma",
        "image_emoji": "🌿",
        "status": "active",
        "user_id": "user_001",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "OG Kush",
        "category": "Flower",
        "strain": "Indica",
        "thc_percentage": "20-25%",
        "cbd_percentage": "0.2%",
        "price": 50.00,
        "stock": 15,
        "description": "Classic indica with earthy pine flavors",
        "image_emoji": "🌲",
        "status": "active",
        "user_id": "user_001",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

mock_orders = [
    {
        "id": "order_001",
        "customer_name": "Alice Johnson",
        "customer_phone": "(555) 234-5678",
        "customer_email": "alice@example.com",
        "items_summary": "Blue Dream (3.5g), OG Kush (1g)",
        "total_amount": 187.50,
        "status": "delivered",
        "driver_name": "Mike Wilson",
        "delivery_address": "456 Oak St, Los Angeles, CA",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": "order_002",
        "customer_name": "Bob Smith",
        "customer_phone": "(555) 345-6789",
        "customer_email": "bob@example.com",
        "items_summary": "Blue Dream (7g)",
        "total_amount": 315.00,
        "status": "en-route",
        "driver_name": "Sarah Davis",
        "delivery_address": "789 Pine Ave, Los Angeles, CA",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

# Mock admin customers (managed from admin panel)
mock_customers = [
    {
        "id": "customer_001",
        "name": "John Admin Customer",
        "email": "john.admin@example.com",
        "phone": "(555) 111-1111",
        "address": "123 Admin St, Los Angeles, CA",
        "total_orders": 5,
        "total_spent": 450.00,
        "average_order_value": 90.00,
        "loyalty_tier": "silver",
        "status": "active",
        "user_id": "user_001",
        "source": "admin",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_order_date": datetime.utcnow()
    }
]

# Mock storefront customers (signed up through store)
mock_customer_auth = [
    {
        "id": "customer_auth_001",
        "name": "Jane Storefront Customer",
        "email": "jane.storefront@example.com",
        "phone": "(555) 222-2222",
        "address": "456 Storefront Ave, Los Angeles, CA",
        "password_hash": pwd_context.hash("password123"),
        "date_of_birth": "1990-01-01",
        "total_orders": 3,
        "total_spent": 225.00,
        "loyalty_tier": "bronze",
        "status": "active",
        "store_id": "user_001",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_order_date": datetime.utcnow()
    },
    {
        "id": "customer_auth_002",
        "name": "Mike Store Customer",
        "email": "mike.store@example.com",
        "phone": "(555) 333-3333",
        "address": "789 Store Blvd, Los Angeles, CA",
        "password_hash": pwd_context.hash("password123"),
        "date_of_birth": "1985-05-15",
        "total_orders": 8,
        "total_spent": 640.00,
        "loyalty_tier": "gold",
        "status": "active",
        "store_id": "user_001",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_order_date": datetime.utcnow()
    }
]

class MockDatabase:
    """Mock database class that mimics MongoDB operations"""
    
    def __init__(self):
        self.users = MockCollection(mock_users)
        self.products = MockCollection(mock_products)
        self.orders = MockCollection(mock_orders)
        self.customers = MockCollection(mock_customers)
        self.customer_auth = MockCollection(mock_customer_auth)
    
    async def command(self, cmd):
        """Mock database command for health checks"""
        if cmd == "ping":
            return {"ok": 1}
        return {"ok": 0}

class MockCursor:
    """Mock cursor class that mimics MongoDB cursor operations"""
    
    def __init__(self, data):
        self.data = data
    
    async def to_list(self, length=None):
        """Convert cursor to list"""
        if length is None:
            return self.data
        return self.data[:length]
    
    def sort(self, key, direction=1):
        """Sort results"""
        if direction == 1:  # Ascending
            self.data.sort(key=lambda x: x.get(key, ""))
        else:  # Descending
            self.data.sort(key=lambda x: x.get(key, ""), reverse=True)
        return self

class MockCollection:
    """Mock collection class that mimics MongoDB collection operations"""
    
    def __init__(self, data):
        self.data = data.copy()
    
    async def find_one(self, query):
        """Find one document matching the query"""
        for item in self.data:
            if self._matches_query(item, query):
                return item
        return None
    
    def find(self, query=None):
        """Find all documents matching the query"""
        if query is None:
            results = self.data.copy()
        else:
            results = []
            for item in self.data:
                if self._matches_query(item, query):
                    results.append(item)
        return MockCursor(results)
    
    async def insert_one(self, document):
        """Insert a new document"""
        if "id" not in document:
            document["id"] = str(uuid.uuid4())
        document["created_at"] = datetime.utcnow()
        document["updated_at"] = datetime.utcnow()
        self.data.append(document)
        return document
    
    async def update_one(self, query, update):
        """Update one document"""
        for i, item in enumerate(self.data):
            if self._matches_query(item, query):
                if "$set" in update:
                    self.data[i].update(update["$set"])
                self.data[i]["updated_at"] = datetime.utcnow()
                return self.data[i]
        return None
    
    async def delete_one(self, query):
        """Delete one document"""
        for i, item in enumerate(self.data):
            if self._matches_query(item, query):
                deleted = self.data.pop(i)
                return {"deleted_count": 1}
        return {"deleted_count": 0}
    
    async def count_documents(self, query):
        """Count documents matching the query"""
        count = 0
        for item in self.data:
            if self._matches_query(item, query):
                count += 1
        return count
    
    def aggregate(self, pipeline):
        """Aggregate documents (simplified implementation)"""
        # For now, just implement basic aggregation for our stats
        return MockCursor([])
    
    def _matches_query(self, item, query):
        """Check if an item matches the given query"""
        for key, value in query.items():
            if key not in item:
                return False
            if isinstance(value, dict):
                # Handle MongoDB operators like $gt
                for op, op_value in value.items():
                    if op == "$gt" and item[key] <= op_value:
                        return False
                    elif op == "$lt" and item[key] >= op_value:
                        return False
                    elif op == "$gte" and item[key] < op_value:
                        return False
                    elif op == "$lte" and item[key] > op_value:
                        return False
                    elif op == "$ne" and item[key] == op_value:
                        return False
            elif item[key] != value:
                return False
        return True

# Global mock database instance
mock_db = MockDatabase()

async def get_mock_database():
    """Get the mock database instance"""
    return mock_db
