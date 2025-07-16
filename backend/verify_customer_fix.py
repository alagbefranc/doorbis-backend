#!/usr/bin/env python3

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json
from datetime import datetime

async def verify_customer_fix():
    """Verify that the customer fix is working"""
    print("=== VERIFYING CUSTOMER FIX ===")
    
    # Test the customer API endpoint
    print("\n1. Testing customer API endpoint:")
    
    try:
        # First, let's try to login to get a token
        login_data = {
            "email": "owner@greenvalley.com",
            "password": "password"
        }
        
        login_response = requests.post("http://localhost:8000/api/auth/login", json=login_data)
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data.get("access_token")
            print(f"   ✓ Successfully logged in as {login_data['email']}")
            
            # Now test the customers endpoint
            headers = {"Authorization": f"Bearer {token}"}
            customers_response = requests.get("http://localhost:8000/api/customers/", headers=headers)
            
            if customers_response.status_code == 200:
                customers = customers_response.json()
                print(f"   ✓ Successfully retrieved {len(customers)} customers from API")
                
                print("\n   Customer details:")
                for i, customer in enumerate(customers, 1):
                    print(f"     {i}. {customer.get('name')} ({customer.get('email')})")
                    print(f"        - Source: {customer.get('source', 'N/A')}")
                    print(f"        - Status: {customer.get('status', 'N/A')}")
                    print(f"        - Total Orders: {customer.get('total_orders', 0)}")
                    print(f"        - Total Spent: ${customer.get('total_spent', 0.0)}")
                
                # Test customer stats
                stats_response = requests.get("http://localhost:8000/api/customers/stats/overview", headers=headers)
                if stats_response.status_code == 200:
                    stats = stats_response.json()
                    print(f"\n   ✓ Customer Stats:")
                    print(f"     - Total Customers: {stats.get('total_customers', 0)}")
                    print(f"     - Active Customers: {stats.get('active_customers', 0)}")
                    print(f"     - Average Order Value: ${stats.get('avg_order_value', 0.0)}")
                    print(f"     - Repeat Customers: {stats.get('repeat_customers_count', 0)} ({stats.get('repeat_customers_percentage', 0.0)}%)")
                else:
                    print(f"   ✗ Failed to get customer stats: {stats_response.status_code}")
                    print(f"     Response: {stats_response.text}")
                
            else:
                print(f"   ✗ Failed to get customers: {customers_response.status_code}")
                print(f"     Response: {customers_response.text}")
        else:
            print(f"   ✗ Failed to login: {login_response.status_code}")
            print(f"     Response: {login_response.text}")
            
    except requests.ConnectionError:
        print("   ✗ Could not connect to backend server. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"   ✗ Error testing API: {e}")
    
    print("\n=== VERIFICATION COMPLETE ===")
    
    # Summary
    print("\n=== SUMMARY ===")
    print("If you see customers listed above, the fix is working!")
    print("The frontend should now display customers who signed up through the storefront.")
    print("\nNext steps:")
    print("1. Refresh your frontend customer page")
    print("2. Check the browser console for any errors")
    print("3. Verify that new storefront signups appear in the customer list")

if __name__ == "__main__":
    asyncio.run(verify_customer_fix())
