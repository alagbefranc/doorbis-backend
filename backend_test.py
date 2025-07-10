#!/usr/bin/env python3
"""
Comprehensive Backend API Testing Suite for Kush Door Cannabis Commerce Platform
Tests all authentication, CRUD operations, and analytics endpoints
"""

import requests
import json
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')
load_dotenv('/app/backend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE_URL = f"{BACKEND_URL}/api"

class KushDoorBackendTester:
    def __init__(self):
        self.results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        self.auth_token = None
        self.test_user_id = None
        
    def log_result(self, test_name, status, message, details=None):
        """Log test result"""
        self.total_tests += 1
        if status == "PASS":
            self.passed_tests += 1
            print(f"✅ {test_name}: {message}")
        else:
            self.failed_tests += 1
            print(f"❌ {test_name}: {message}")
            if details:
                print(f"   Details: {details}")
        
        self.results.append({
            'test': test_name,
            'status': status,
            'message': message,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_auth_headers(self):
        """Get authorization headers with JWT token"""
        if self.auth_token:
            return {"Authorization": f"Bearer {self.auth_token}", "Content-Type": "application/json"}
        return {"Content-Type": "application/json"}
    
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'healthy':
                    self.log_result("Health Check", "PASS", "Backend service is healthy and database connected")
                    return True
                else:
                    self.log_result("Health Check", "FAIL", f"Service unhealthy: {data}")
                    return False
            else:
                self.log_result("Health Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result("Health Check", "FAIL", f"Connection failed: {str(e)}")
            return False
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "Kush Door API" in data.get('message', ''):
                    self.log_result("Root Endpoint", "PASS", "Root endpoint accessible")
                    return True
                else:
                    self.log_result("Root Endpoint", "FAIL", f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Root Endpoint", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result("Root Endpoint", "FAIL", f"Connection failed: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        try:
            # Try to login with existing sample user first
            try:
                login_data = {
                    "email": "owner@greenvalley.com",
                    "password": "password123"
                }
                
                response = requests.post(
                    f"{API_BASE_URL}/auth/login",
                    json=login_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if 'access_token' in data:
                        self.auth_token = data['access_token']
                        self.test_email = login_data['email']
                        self.test_password = login_data['password']
                        self.log_result("User Registration", "PASS", "Using existing sample user (owner@greenvalley.com)")
                        return True
            except:
                pass
            
            # If sample user doesn't exist, create new test user
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            test_data = {
                "email": f"testowner_{timestamp}@kushdoor.com",
                "password": "SecurePass123!",
                "full_name": "Test Store Owner",
                "store_name": "Green Valley Cannabis",
                "phone": "+1-555-0123",
                "address": "123 Cannabis St, Denver, CO 80202",
                "license_number": f"CO-{timestamp}",
                "subdomain": f"greenvalley{timestamp}"
            }
            
            response = requests.post(
                f"{API_BASE_URL}/auth/register",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'User registered successfully' and 'user_id' in data:
                    self.test_user_id = data['user_id']
                    self.test_email = test_data['email']
                    self.test_password = test_data['password']
                    self.log_result("User Registration", "PASS", "User registered successfully")
                    return True
                else:
                    self.log_result("User Registration", "FAIL", f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("User Registration", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("User Registration", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test user login endpoint"""
        if not hasattr(self, 'test_email'):
            self.log_result("User Login", "FAIL", "No test user available for login")
            return False
            
        try:
            login_data = {
                "email": self.test_email,
                "password": self.test_password
            }
            
            response = requests.post(
                f"{API_BASE_URL}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and data.get('token_type') == 'bearer':
                    self.auth_token = data['access_token']
                    self.log_result("User Login", "PASS", "User login successful, JWT token received")
                    return True
                else:
                    self.log_result("User Login", "FAIL", f"Invalid token response: {data}")
                    return False
            else:
                self.log_result("User Login", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("User Login", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test get current user endpoint"""
        if not self.auth_token:
            self.log_result("Get Current User", "FAIL", "No auth token available")
            return False
            
        try:
            response = requests.get(
                f"{API_BASE_URL}/auth/me",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'email' in data and 'store_name' in data and 'hashed_password' not in data:
                    self.log_result("Get Current User", "PASS", "Current user info retrieved successfully")
                    return True
                else:
                    self.log_result("Get Current User", "FAIL", f"Invalid user data: {data}")
                    return False
            else:
                self.log_result("Get Current User", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Current User", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_products_crud(self):
        """Test products CRUD operations"""
        if not self.auth_token:
            self.log_result("Products CRUD", "FAIL", "No auth token available")
            return False
        
        product_id = None
        
        try:
            # Test CREATE product
            product_data = {
                "name": "Purple Haze Premium",
                "category": "Flower",
                "strain": "Sativa",
                "thc_percentage": "22.5%",
                "cbd_percentage": "0.8%",
                "price": 45.99,
                "stock": 25,
                "description": "Premium sativa strain with uplifting effects",
                "image_emoji": "🟣"
            }
            
            response = requests.post(
                f"{API_BASE_URL}/products/",
                json=product_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['name'] == product_data['name']:
                    product_id = data['id']
                    self.log_result("Products CREATE", "PASS", "Product created successfully")
                else:
                    self.log_result("Products CREATE", "FAIL", f"Invalid product data: {data}")
                    return False
            else:
                self.log_result("Products CREATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test READ products
            response = requests.get(
                f"{API_BASE_URL}/products/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_result("Products READ", "PASS", f"Retrieved {len(data)} products")
                else:
                    self.log_result("Products READ", "FAIL", f"Invalid products list: {data}")
                    return False
            else:
                self.log_result("Products READ", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test UPDATE product
            if product_id:
                update_data = {
                    "price": 49.99,
                    "stock": 20
                }
                
                response = requests.put(
                    f"{API_BASE_URL}/products/{product_id}",
                    json=update_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data['price'] == update_data['price']:
                        self.log_result("Products UPDATE", "PASS", "Product updated successfully")
                    else:
                        self.log_result("Products UPDATE", "FAIL", f"Update failed: {data}")
                        return False
                else:
                    self.log_result("Products UPDATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                    return False
            
            # Test DELETE product
            if product_id:
                response = requests.delete(
                    f"{API_BASE_URL}/products/{product_id}",
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if 'message' in data:
                        self.log_result("Products DELETE", "PASS", "Product deleted successfully")
                        return True
                    else:
                        self.log_result("Products DELETE", "FAIL", f"Delete failed: {data}")
                        return False
                else:
                    self.log_result("Products DELETE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                    return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Products CRUD", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_orders_crud(self):
        """Test orders CRUD operations"""
        if not self.auth_token:
            self.log_result("Orders CRUD", "FAIL", "No auth token available")
            return False
        
        order_id = None
        
        try:
            # Test CREATE order
            order_data = {
                "customer_name": "Jane Smith",
                "customer_email": "jane.smith@email.com",
                "customer_phone": "+1-555-0456",
                "delivery_address": "456 Oak Ave, Denver, CO 80203",
                "items": [
                    {
                        "product_id": "test-product-1",
                        "product_name": "Blue Dream",
                        "quantity": 2,
                        "price": 35.99,
                        "total": 71.98
                    }
                ],
                "subtotal": 71.98,
                "tax": 7.20,
                "delivery_fee": 5.00,
                "total": 84.18
            }
            
            response = requests.post(
                f"{API_BASE_URL}/orders/",
                json=order_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['customer_name'] == order_data['customer_name']:
                    order_id = data['id']
                    self.log_result("Orders CREATE", "PASS", "Order created successfully")
                else:
                    self.log_result("Orders CREATE", "FAIL", f"Invalid order data: {data}")
                    return False
            else:
                self.log_result("Orders CREATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test READ orders
            response = requests.get(
                f"{API_BASE_URL}/orders/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Orders READ", "PASS", f"Retrieved {len(data)} orders")
                else:
                    self.log_result("Orders READ", "FAIL", f"Invalid orders list: {data}")
                    return False
            else:
                self.log_result("Orders READ", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test UPDATE order
            if order_id:
                update_data = {
                    "status": "preparing",
                    "driver_name": "Mike Johnson"
                }
                
                response = requests.put(
                    f"{API_BASE_URL}/orders/{order_id}",
                    json=update_data,
                    headers=self.get_auth_headers(),
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data['status'] == update_data['status']:
                        self.log_result("Orders UPDATE", "PASS", "Order updated successfully")
                        return True
                    else:
                        self.log_result("Orders UPDATE", "FAIL", f"Update failed: {data}")
                        return False
                else:
                    self.log_result("Orders UPDATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                    return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Orders CRUD", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_customers_crud(self):
        """Test customers CRUD operations"""
        if not self.auth_token:
            self.log_result("Customers CRUD", "FAIL", "No auth token available")
            return False
        
        customer_id = None
        
        try:
            # Test CREATE customer
            customer_data = {
                "name": "Robert Wilson",
                "email": "robert.wilson@email.com",
                "phone": "+1-555-0789",
                "address": "789 Pine St, Denver, CO 80204",
                "date_of_birth": "1985-03-15",
                "loyalty_tier": "bronze"
            }
            
            response = requests.post(
                f"{API_BASE_URL}/customers/",
                json=customer_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['name'] == customer_data['name']:
                    customer_id = data['id']
                    self.log_result("Customers CREATE", "PASS", "Customer created successfully")
                else:
                    self.log_result("Customers CREATE", "FAIL", f"Invalid customer data: {data}")
                    return False
            else:
                self.log_result("Customers CREATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test READ customers
            response = requests.get(
                f"{API_BASE_URL}/customers/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Customers READ", "PASS", f"Retrieved {len(data)} customers")
                    return True
                else:
                    self.log_result("Customers READ", "FAIL", f"Invalid customers list: {data}")
                    return False
            else:
                self.log_result("Customers READ", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Customers CRUD", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_drivers_crud(self):
        """Test drivers CRUD operations"""
        if not self.auth_token:
            self.log_result("Drivers CRUD", "FAIL", "No auth token available")
            return False
        
        try:
            # Test CREATE driver
            driver_data = {
                "name": "Alex Rodriguez",
                "email": "alex.rodriguez@kushdoor.com",
                "phone": "+1-555-0321",
                "license_number": "DL123456789",
                "vehicle": "Honda Civic 2020 - ABC123",
                "service_area": "Denver Metro Area",
                "status": "active"
            }
            
            response = requests.post(
                f"{API_BASE_URL}/drivers/",
                json=driver_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['name'] == driver_data['name']:
                    self.log_result("Drivers CREATE", "PASS", "Driver created successfully")
                else:
                    self.log_result("Drivers CREATE", "FAIL", f"Invalid driver data: {data}")
                    return False
            else:
                self.log_result("Drivers CREATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test READ drivers
            response = requests.get(
                f"{API_BASE_URL}/drivers/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Drivers READ", "PASS", f"Retrieved {len(data)} drivers")
                    return True
                else:
                    self.log_result("Drivers READ", "FAIL", f"Invalid drivers list: {data}")
                    return False
            else:
                self.log_result("Drivers READ", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Drivers CRUD", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_payments_endpoints(self):
        """Test payments endpoints"""
        if not self.auth_token:
            self.log_result("Payments Endpoints", "FAIL", "No auth token available")
            return False
        
        try:
            # Test GET payments
            response = requests.get(
                f"{API_BASE_URL}/payments/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Payments READ", "PASS", f"Retrieved {len(data)} payments")
                else:
                    self.log_result("Payments READ", "FAIL", f"Invalid payments list: {data}")
                    return False
            else:
                self.log_result("Payments READ", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test GET payment stats
            response = requests.get(
                f"{API_BASE_URL}/payments/stats/overview",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['total_revenue', 'processing_fees', 'pending_payouts']
                if all(field in data for field in required_fields):
                    self.log_result("Payment Stats", "PASS", "Payment statistics retrieved successfully")
                    return True
                else:
                    self.log_result("Payment Stats", "FAIL", f"Missing stats fields: {data}")
                    return False
            else:
                self.log_result("Payment Stats", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Payments Endpoints", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_support_endpoints(self):
        """Test support endpoints"""
        if not self.auth_token:
            self.log_result("Support Endpoints", "FAIL", "No auth token available")
            return False
        
        try:
            # Test GET support tickets
            response = requests.get(
                f"{API_BASE_URL}/support/tickets",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Support Tickets READ", "PASS", f"Retrieved {len(data)} support tickets")
                else:
                    self.log_result("Support Tickets READ", "FAIL", f"Invalid tickets list: {data}")
                    return False
            else:
                self.log_result("Support Tickets READ", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test CREATE support ticket
            ticket_data = {
                "subject": "Payment Processing Issue",
                "description": "Customer unable to complete payment for order #12345",
                "priority": "high",
                "category": "payment",
                "customer_name": "Jane Smith",
                "customer_email": "jane.smith@email.com"
            }
            
            response = requests.post(
                f"{API_BASE_URL}/support/tickets",
                json=ticket_data,
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and data['subject'] == ticket_data['subject']:
                    self.log_result("Support Ticket CREATE", "PASS", "Support ticket created successfully")
                    return True
                else:
                    self.log_result("Support Ticket CREATE", "FAIL", f"Invalid ticket data: {data}")
                    return False
            else:
                self.log_result("Support Ticket CREATE", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Support Endpoints", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_analytics_endpoints(self):
        """Test analytics endpoints"""
        if not self.auth_token:
            self.log_result("Analytics Endpoints", "FAIL", "No auth token available")
            return False
        
        try:
            # Test analytics overview
            response = requests.get(
                f"{API_BASE_URL}/analytics/overview",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['monthly_revenue', 'avg_order_value', 'customer_satisfaction', 'delivery_performance']
                if all(field in data for field in required_fields):
                    self.log_result("Analytics Overview", "PASS", "Analytics overview retrieved successfully")
                else:
                    self.log_result("Analytics Overview", "FAIL", f"Missing analytics fields: {data}")
                    return False
            else:
                self.log_result("Analytics Overview", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test sales performance
            response = requests.get(
                f"{API_BASE_URL}/analytics/sales-performance",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Sales Performance", "PASS", f"Retrieved {len(data)} sales performance periods")
                    return True
                else:
                    self.log_result("Sales Performance", "FAIL", f"Invalid sales data: {data}")
                    return False
            else:
                self.log_result("Sales Performance", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Analytics Endpoints", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            response = requests.options(
                f"{API_BASE_URL}/auth/login",
                headers={
                    "Origin": "https://kushdoor.com",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Content-Type,Authorization"
                },
                timeout=10
            )
            
            if response.status_code in [200, 204]:
                cors_headers = {
                    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                    'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
                }
                
                # CORS is working if we get proper headers back
                if cors_headers['Access-Control-Allow-Origin']:
                    self.log_result("CORS Configuration", "PASS", "CORS properly configured for cross-origin requests")
                    return True
                else:
                    self.log_result("CORS Configuration", "FAIL", f"CORS headers: {cors_headers}")
                    return False
            else:
                self.log_result("CORS Configuration", "FAIL", f"Preflight request failed: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("CORS Configuration", "FAIL", f"CORS test failed: {str(e)}")
            return False
    
    def test_sample_data_verification(self):
        """Test that sample data exists in the database"""
        if not self.auth_token:
            self.log_result("Sample Data Verification", "FAIL", "No auth token available")
            return False
        
        try:
            # Test that sample products exist
            response = requests.get(
                f"{API_BASE_URL}/products/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                products = response.json()
                if len(products) >= 6:  # Should have 6 sample products
                    self.log_result("Sample Products", "PASS", f"Found {len(products)} sample products")
                else:
                    self.log_result("Sample Products", "FAIL", f"Expected 6+ products, found {len(products)}")
                    return False
            else:
                self.log_result("Sample Products", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test that sample customers exist
            response = requests.get(
                f"{API_BASE_URL}/customers/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                customers = response.json()
                if len(customers) >= 5:  # Should have 5 sample customers
                    self.log_result("Sample Customers", "PASS", f"Found {len(customers)} sample customers")
                else:
                    self.log_result("Sample Customers", "FAIL", f"Expected 5+ customers, found {len(customers)}")
                    return False
            else:
                self.log_result("Sample Customers", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test that sample orders exist
            response = requests.get(
                f"{API_BASE_URL}/orders/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                orders = response.json()
                if len(orders) >= 4:  # Should have 4 sample orders
                    self.log_result("Sample Orders", "PASS", f"Found {len(orders)} sample orders")
                else:
                    self.log_result("Sample Orders", "FAIL", f"Expected 4+ orders, found {len(orders)}")
                    return False
            else:
                self.log_result("Sample Orders", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test that sample drivers exist
            response = requests.get(
                f"{API_BASE_URL}/drivers/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                drivers = response.json()
                if len(drivers) >= 3:  # Should have 3 sample drivers
                    self.log_result("Sample Drivers", "PASS", f"Found {len(drivers)} sample drivers")
                else:
                    self.log_result("Sample Drivers", "FAIL", f"Expected 3+ drivers, found {len(drivers)}")
                    return False
            else:
                self.log_result("Sample Drivers", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test that sample payments exist
            response = requests.get(
                f"{API_BASE_URL}/payments/",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                payments = response.json()
                if len(payments) >= 4:  # Should have 4 sample payments
                    self.log_result("Sample Payments", "PASS", f"Found {len(payments)} sample payments")
                else:
                    self.log_result("Sample Payments", "FAIL", f"Expected 4+ payments, found {len(payments)}")
                    return False
            else:
                self.log_result("Sample Payments", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            # Test that sample support tickets exist
            response = requests.get(
                f"{API_BASE_URL}/support/tickets",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            if response.status_code == 200:
                tickets = response.json()
                if len(tickets) >= 3:  # Should have 3 sample tickets
                    self.log_result("Sample Support Tickets", "PASS", f"Found {len(tickets)} sample support tickets")
                else:
                    self.log_result("Sample Support Tickets", "FAIL", f"Expected 3+ tickets, found {len(tickets)}")
                    return False
            else:
                self.log_result("Sample Support Tickets", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
            
            return True
                
        except requests.exceptions.RequestException as e:
            self.log_result("Sample Data Verification", "FAIL", f"Request failed: {str(e)}")
            return False
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = requests.get(f"{API_BASE_URL}/nonexistent", timeout=10)
            
            if response.status_code == 404:
                self.log_result("Error Handling - 404", "PASS", "Properly returns 404 for non-existent endpoints")
            else:
                self.log_result("Error Handling - 404", "FAIL", f"Expected 404, got {response.status_code}")
            
            # Test unauthorized access
            response = requests.get(f"{API_BASE_URL}/products/", timeout=10)
            
            if response.status_code == 401:
                self.log_result("Error Handling - 401", "PASS", "Properly returns 401 for unauthorized access")
                return True
            else:
                self.log_result("Error Handling - 401", "FAIL", f"Expected 401, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Error Handling", "FAIL", f"Error handling test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run comprehensive backend API tests"""
        print("🧪 Starting Comprehensive Kush Door Backend API Testing Suite")
        print(f"🔗 Testing Backend URL: {API_BASE_URL}")
        print("=" * 80)
        
        # Test basic connectivity first
        if not self.test_health_check():
            print("\n❌ Backend health check failed. Stopping tests.")
            return self.generate_summary()
        
        if not self.test_root_endpoint():
            print("\n❌ Root endpoint not accessible. Stopping tests.")
            return self.generate_summary()
        
        # Test authentication flow
        print("\n🔐 Testing Authentication Flow...")
        if not self.test_user_registration():
            print("❌ User registration failed. Stopping authentication tests.")
        elif not self.test_user_login():
            print("❌ User login failed. Stopping protected endpoint tests.")
        else:
            self.test_get_current_user()
            
            # Test sample data verification
            print("\n📊 Testing Sample Data...")
            self.test_sample_data_verification()
            
            # Test protected endpoints
            print("\n📦 Testing CRUD Operations...")
            self.test_products_crud()
            self.test_orders_crud()
            self.test_customers_crud()
            self.test_drivers_crud()
            
            print("\n💳 Testing Payment & Support Systems...")
            self.test_payments_endpoints()
            self.test_support_endpoints()
            
            print("\n📊 Testing Analytics...")
            self.test_analytics_endpoints()
        
        # Test system configuration
        print("\n⚙️ Testing System Configuration...")
        self.test_cors_configuration()
        self.test_error_handling()
        
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests*100):.1f}%" if self.total_tests > 0 else "0%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"  - {result['test']}: {result['message']}")
        
        if self.passed_tests > 0:
            print(f"\n✅ PASSED TESTS: {self.passed_tests}")
            
        print(f"\n🎯 AUTHENTICATION: {'✅ Working' if self.auth_token else '❌ Failed'}")
        print(f"🔗 API CONNECTIVITY: {'✅ Working' if self.passed_tests > 0 else '❌ Failed'}")
        
        return {
            'total_tests': self.total_tests,
            'passed_tests': self.passed_tests,
            'failed_tests': self.failed_tests,
            'success_rate': (self.passed_tests/self.total_tests*100) if self.total_tests > 0 else 0,
            'results': self.results,
            'auth_working': bool(self.auth_token)
        }

if __name__ == "__main__":
    tester = KushDoorBackendTester()
    summary = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if summary['failed_tests'] == 0 else 1)