// API service for Kush Door platform
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Authentication methods
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('auth_token', this.token);
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to get user data' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  // Demo Products API (no auth required)
  async getDemoProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/demo`);

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch demo products' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDemoProductStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/demo/stats`);

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch demo product stats' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Products API
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch products' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail || 'Failed to create product' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail || 'Failed to update product' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete product' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProductStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/stats/overview`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch product stats' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Orders API
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch orders' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateOrder(orderId, orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail || 'Failed to update order' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOrderStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/stats/overview`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch order stats' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Customers API
  async getCustomers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch customers' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getCustomerStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/stats/overview`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch customer stats' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Analytics API
  async getAnalyticsOverview() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/overview`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch analytics overview' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getSalesPerformance() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/sales-performance`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch sales performance' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTopProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/top-products`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Failed to fetch top products' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return { success: false, error: 'Health check failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }
}

export default new ApiService();