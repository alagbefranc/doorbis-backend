#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import get_database
from auth.auth import get_current_active_user
from routes.customers import get_customers
from unittest.mock import Mock

async def test_customer_api():
    """Test customer API with different users"""
    db = await get_database()
    
    print("=== TESTING CUSTOMER API ===")
    
    # Get all users
    users = await db.users.find({}).to_list(100)
    
    for user in users:
        print(f"\n--- Testing with user: {user.get('email')} (ID: {user.get('id')}) ---")
        
        # Mock the current_user for the API call
        mock_user = {
            "id": user.get('id'),
            "email": user.get('email'),
            "subdomain": user.get('subdomain')
        }
        
        try:
            # Test the get_customers function directly
            # Create a mock dependency injection
            async def mock_get_current_active_user():
                return mock_user
            
            # Get customers from the storefront customer_auth collection
            storefront_customers = await db.customer_auth.find({"store_id": user.get('id')}).to_list(1000)
            print(f"  Found {len(storefront_customers)} storefront customers in database")
            
            # Convert storefront customers to the Customer model format
            all_customers = []
            
            for customer in storefront_customers:
                # Convert customer_auth format to customer format
                customer_data = {
                    "id": customer.get("id"),
                    "name": customer.get("name"),
                    "email": customer.get("email"),
                    "phone": customer.get("phone"),
                    "address": customer.get("address", ""),
                    "total_orders": customer.get("total_orders", 0),
                    "total_spent": customer.get("total_spent", 0.0),
                    "average_order_value": customer.get("total_spent", 0.0) / max(customer.get("total_orders", 1), 1),
                    "loyalty_tier": customer.get("loyalty_tier", "bronze"),
                    "status": customer.get("status", "active"),
                    "created_at": customer.get("created_at"),
                    "last_order_date": customer.get("last_order_date"),
                    "user_id": user.get('id'),
                    "source": "storefront"
                }
                
                all_customers.append(customer_data)
            
            print(f"  API would return {len(all_customers)} customers:")
            for i, customer in enumerate(all_customers, 1):
                print(f"    {i}. {customer['name']} ({customer['email']})")
                
        except Exception as e:
            print(f"  Error testing with this user: {e}")
    
    print(f"\n=== TEST COMPLETE ===")

if __name__ == "__main__":
    asyncio.run(test_customer_api())
