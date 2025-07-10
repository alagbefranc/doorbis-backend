#!/usr/bin/env python3
"""
Backend API Testing Suite for Kush Door Cannabis Commerce Platform
Tests all backend endpoints and database connectivity
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

class BackendTester:
    def __init__(self):
        self.results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
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
    
    def test_service_health(self):
        """Test if backend service is accessible"""
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    self.log_result("Service Health Check", "PASS", "Backend service is running and accessible")
                    return True
                else:
                    self.log_result("Service Health Check", "FAIL", f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Service Health Check", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result("Service Health Check", "FAIL", f"Connection failed: {str(e)}")
            return False
    
    def test_status_check_creation(self):
        """Test creating a status check entry"""
        try:
            test_data = {
                "client_name": "Kush Door Test Client"
            }
            
            response = requests.post(
                f"{API_BASE_URL}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['client_name'] == test_data['client_name']:
                        self.log_result("Status Check Creation", "PASS", "Successfully created status check entry")
                        return data['id']
                    else:
                        self.log_result("Status Check Creation", "FAIL", "Client name mismatch in response")
                        return None
                else:
                    missing_fields = [field for field in required_fields if field not in data]
                    self.log_result("Status Check Creation", "FAIL", f"Missing required fields: {missing_fields}")
                    return None
            else:
                self.log_result("Status Check Creation", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_result("Status Check Creation", "FAIL", f"Request failed: {str(e)}")
            return None
    
    def test_status_check_retrieval(self):
        """Test retrieving status check entries"""
        try:
            response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if the entries have required fields
                        required_fields = ['id', 'client_name', 'timestamp']
                        first_entry = data[0]
                        
                        if all(field in first_entry for field in required_fields):
                            self.log_result("Status Check Retrieval", "PASS", f"Successfully retrieved {len(data)} status check entries")
                            return True
                        else:
                            missing_fields = [field for field in required_fields if field not in first_entry]
                            self.log_result("Status Check Retrieval", "FAIL", f"Entries missing required fields: {missing_fields}")
                            return False
                    else:
                        self.log_result("Status Check Retrieval", "PASS", "Successfully retrieved empty status check list")
                        return True
                else:
                    self.log_result("Status Check Retrieval", "FAIL", f"Expected list, got {type(data)}")
                    return False
            else:
                self.log_result("Status Check Retrieval", "FAIL", f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Status Check Retrieval", "FAIL", f"Request failed: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            response = requests.options(
                f"{API_BASE_URL}/status",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Content-Type"
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
                if cors_headers['Access-Control-Allow-Origin'] and cors_headers['Access-Control-Allow-Methods']:
                    self.log_result("CORS Configuration", "PASS", "CORS is properly configured for cross-origin requests")
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
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = requests.get(f"{API_BASE_URL}/nonexistent", timeout=10)
            
            if response.status_code == 404:
                self.log_result("Error Handling - 404", "PASS", "Properly returns 404 for non-existent endpoints")
            else:
                self.log_result("Error Handling - 404", "FAIL", f"Expected 404, got {response.status_code}")
            
            # Test invalid POST data
            response = requests.post(
                f"{API_BASE_URL}/status",
                json={"invalid_field": "test"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code in [400, 422]:
                self.log_result("Error Handling - Invalid Data", "PASS", "Properly handles invalid POST data")
                return True
            else:
                self.log_result("Error Handling - Invalid Data", "FAIL", f"Expected 400/422, got {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Error Handling", "FAIL", f"Error handling test failed: {str(e)}")
            return False
    
    def test_database_connectivity(self):
        """Test database connectivity by creating and retrieving data"""
        try:
            # Create a test entry
            test_client_name = f"DB Test Client {datetime.now().strftime('%Y%m%d_%H%M%S')}"
            create_response = requests.post(
                f"{API_BASE_URL}/status",
                json={"client_name": test_client_name},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_result("Database Connectivity", "FAIL", "Failed to create test entry")
                return False
            
            created_entry = create_response.json()
            
            # Retrieve all entries and check if our test entry exists
            retrieve_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if retrieve_response.status_code != 200:
                self.log_result("Database Connectivity", "FAIL", "Failed to retrieve entries")
                return False
            
            all_entries = retrieve_response.json()
            
            # Check if our test entry exists in the retrieved data
            test_entry_found = any(
                entry.get('client_name') == test_client_name 
                for entry in all_entries
            )
            
            if test_entry_found:
                self.log_result("Database Connectivity", "PASS", "Database read/write operations working correctly")
                return True
            else:
                self.log_result("Database Connectivity", "FAIL", "Created entry not found in database")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Database Connectivity", "FAIL", f"Database connectivity test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting Backend API Testing Suite")
        print(f"🔗 Testing Backend URL: {API_BASE_URL}")
        print("=" * 60)
        
        # Test service health first
        if not self.test_service_health():
            print("\n❌ Backend service is not accessible. Stopping tests.")
            return self.generate_summary()
        
        # Run all other tests
        self.test_status_check_creation()
        self.test_status_check_retrieval()
        self.test_cors_configuration()
        self.test_error_handling()
        self.test_database_connectivity()
        
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests*100):.1f}%" if self.total_tests > 0 else "0%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"  - {result['test']}: {result['message']}")
        
        return {
            'total_tests': self.total_tests,
            'passed_tests': self.passed_tests,
            'failed_tests': self.failed_tests,
            'success_rate': (self.passed_tests/self.total_tests*100) if self.total_tests > 0 else 0,
            'results': self.results
        }

if __name__ == "__main__":
    tester = BackendTester()
    summary = tester.run_all_tests()
    
    # Exit with error code if tests failed
    sys.exit(0 if summary['failed_tests'] == 0 else 1)