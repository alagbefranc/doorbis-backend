import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import ApiService from './services/api';

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-8 h-8 text-green-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
          </svg>
        </div>
        <span className="font-unbounded text-white text-lg font-light">DoorBis</span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 font-manrope text-white/80 text-sm">
        <Link to="/features" className={`hover:text-green-400 transition-colors ${location.pathname === '/features' ? 'text-green-400' : ''}`}>Features</Link>
        <Link to="/dispensaries" className={`hover:text-green-400 transition-colors ${location.pathname === '/dispensaries' ? 'text-green-400' : ''}`}>For Dispensaries</Link>
        <Link to="/drivers" className={`hover:text-green-400 transition-colors ${location.pathname === '/drivers' ? 'text-green-400' : ''}`}>For Drivers</Link>
        <Link to="/pricing" className={`hover:text-green-400 transition-colors ${location.pathname === '/pricing' ? 'text-green-400' : ''}`}>Pricing</Link>
        <Link to="/faq" className={`hover:text-green-400 transition-colors ${location.pathname === '/faq' ? 'text-green-400' : ''}`}>FAQ</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <select className="bg-transparent border border-white/40 text-white/80 text-sm px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
        <Link to="/login" className="border border-white/40 text-white/80 px-4 py-1 rounded-full hover:bg-white/10 transition-colors font-manrope text-sm">
          Login
        </Link>
      </div>
    </nav>
  );
};

// Dashboard Sidebar Component
const DashboardSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
    { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M6 7h12' },
    { id: 'storefront', label: 'Storefront', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'drivers', label: 'Drivers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'payments', label: 'Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'support', label: 'Support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 text-white z-40">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 text-green-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
            </svg>
          </div>
          <span className="font-unbounded text-white text-lg font-light">DoorBis</span>
        </Link>
        <div className="mt-2 text-xs text-gray-400">Cannabis Commerce Platform</div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors hover:bg-zinc-800 ${
              activeSection === item.id ? 'bg-green-600/20 border-r-2 border-green-400 text-green-400' : 'text-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-manrope">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-4 text-white">
          <div className="text-sm font-semibold">Green Valley Dispensary</div>
          <div className="text-xs text-green-100">Premium Plan • Active</div>
        </div>
        <Link 
          to="/login" 
          className="mt-4 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-manrope">Logout</span>
        </Link>
      </div>
    </div>
  );
};

// Dashboard Top Bar Component
const DashboardTopBar = ({ activeSection }) => {
  const getSectionTitle = () => {
    switch(activeSection) {
      case 'dashboard': return 'Dashboard Overview';
      case 'orders': return 'Order Management';
      case 'products': return 'Product Catalog';
      case 'storefront': return 'Storefront Settings';
      case 'drivers': return 'Driver Management';
      case 'payments': return 'Payments & Billing';
      case 'customers': return 'Customer Database';
      case 'analytics': return 'Analytics & Reports';
      case 'support': return 'Support Center';
      case 'settings': return 'Account Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="sticky top-0 z-30 h-16 px-6 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 font-manrope">{getSectionTitle()}</h1>
        <div className="text-sm text-gray-500">Manage your cannabis business</div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 4h7v7H4V4z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
        </button>
        
        <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 4h7v7H4V4z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Store Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sliding Card Component
const SlidingCard = ({ isOpen, onClose, title, children, width = "w-96" }) => {
  return (
    <div className={`fixed inset-y-0 right-0 z-50 ${width} bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold font-manrope">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ setSlideCard }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching dashboard data...');
      
      // Fetch analytics data
      const analyticsResult = await ApiService.getAnalyticsOverview();
      console.log('Analytics result:', analyticsResult);
      if (analyticsResult.success) {
        setAnalyticsData(analyticsResult.data);
        console.log('Analytics data set:', analyticsResult.data);
      } else {
        console.error('Analytics failed:', analyticsResult.error);
      }
      
      // Fetch top products
      const topProductsResult = await ApiService.getTopProducts();
      console.log('Top products result:', topProductsResult);
      if (topProductsResult.success) {
        setTopProducts(topProductsResult.data.slice(0, 5)); // Get top 5
        console.log('Top products set:', topProductsResult.data);
      } else {
        console.error('Top products failed:', topProductsResult.error);
      }
      
      // Fetch recent orders  
      const ordersResult = await ApiService.getOrders();
      console.log('Orders result:', ordersResult);
      if (ordersResult.success) {
        // Backend returns array directly, not data.orders
        const recent = ordersResult.data ? ordersResult.data.slice(0, 3) : [];
        setRecentOrders(recent);
        console.log('Recent orders set:', recent);
      } else {
        console.error('Orders failed:', ordersResult.error);
      }
      
    } catch (error) {
      const errorMsg = `Failed to load dashboard data: ${error.message}`;
      setError(errorMsg);
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => { setError(''); fetchDashboardData(); }}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  // Use ONLY real data from backend - no fallback dummy data
  const overviewCards = [
    { 
      title: 'Total Orders', 
      value: analyticsData?.total_orders?.toString() || '0', 
      color: 'green', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' 
    },
    { 
      title: 'Monthly Revenue', 
      value: analyticsData?.monthly_revenue ? `$${analyticsData.monthly_revenue.toFixed(2)}` : '$0.00', 
      color: 'blue', 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' 
    },
    { 
      title: 'Avg Order Value', 
      value: analyticsData?.avg_order_value ? `$${analyticsData.avg_order_value.toFixed(2)}` : '$0.00', 
      color: 'purple', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
    },
    { 
      title: 'Customer Satisfaction', 
      value: analyticsData?.customer_satisfaction ? `${analyticsData.customer_satisfaction.toFixed(1)}/5` : '0/5', 
      color: 'orange', 
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSlideCard({
              isOpen: true,
              title: `${card.title} Details`,
              content: (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{card.value}</div>
                    <div className="text-sm text-gray-500">Current Value</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current</span>
                      <span className="font-semibold">{card.value}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on real-time data from your backend
                    </div>
                  </div>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Chart visualization coming soon</span>
                  </div>
                </div>
              )
            })}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">{card.title}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{card.value}</div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br from-${card.color}-400 to-${card.color}-600 rounded-lg flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-green-600 font-semibold">Revenue: {analyticsData?.monthly_revenue ? `$${analyticsData.monthly_revenue.toFixed(2)}` : '$0.00'}</div>
              <div className="text-sm text-gray-500 mt-1">Live data from backend</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.name || index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.sales} sales - {product.revenue}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                <p>No product data available</p>
                <button 
                  onClick={fetchDashboardData} 
                  className="mt-2 text-green-600 hover:text-green-800"
                >
                  Refresh Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={order.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_name || 'Unknown Customer'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items_summary || 'No items'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'en-route' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-green-600 hover:text-green-900 transition-colors"
                        onClick={() => setSlideCard({
                          isOpen: true,
                          title: `Order ${order.id}`,
                          content: (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">Customer Information</h4>
                                <div className="mt-2 space-y-1">
                                  <div className="text-sm">Name: {order.customer_name || 'Unknown'}</div>
                                  <div className="text-sm text-gray-600">Phone: {order.customer_phone || 'N/A'}</div>
                                  <div className="text-sm text-gray-600">Email: {order.customer_email || 'N/A'}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Order Details</h4>
                                <div className="mt-2 space-y-1">
                                  <div className="text-sm">Items: {order.items_summary || 'No items'}</div>
                                  <div className="text-sm">Amount: ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</div>
                                  <div className="text-sm">Status: {order.status || 'Unknown'}</div>
                                  <div className="text-sm text-gray-600">Ordered: {order.created_at ? new Date(order.created_at).toLocaleString() : 'Unknown'}</div>
                                </div>
                              </div>
                              <div className="flex space-x-2 pt-4">
                                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                  Update Status
                                </button>
                                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  Contact Customer
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No recent orders available</p>
              <button 
                onClick={fetchDashboardData} 
                className="mt-2 text-green-600 hover:text-green-800"
              >
                Refresh Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Orders Management Component
const OrdersManagement = ({ setSlideCard }) => {
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await ApiService.getOrders();
      if (result.success) {
        // Backend returns array directly
        setOrders(result.data || []);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      setError('Error loading orders');
      console.error('Orders fetch error:', error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const result = await ApiService.getOrderStats();
      if (result.success) {
        setOrderStats(result.data);
      }
    } catch (error) {
      console.error('Order stats fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => { setError(''); fetchOrders(); fetchOrderStats(); }}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'en-route': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Pending Orders</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{orderStats.pending_orders || 0}</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">In Transit</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{orderStats.in_transit_orders || 0}</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9m-6-9a8 8 0 1116 0v9" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Delivered Today</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{orderStats.delivered_today || 0}</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                ${orderStats.total_revenue ? orderStats.total_revenue.toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Status</option>
              <option>Pending</option>
              <option>Preparing</option>
              <option>En Route</option>
              <option>Delivered</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Export Orders
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={order.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer_name || 'Unknown Customer'}</div>
                    <div className="text-sm text-gray-500">{order.customer_phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.items_summary || 'No items'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ') : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.driver_name || 'Not assigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-green-600 hover:text-green-900 transition-colors"
                        onClick={() => setSlideCard({
                          isOpen: true,
                          title: `Order ${order.id} Details`,
                          content: (
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{order.customer_name || 'Unknown'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium">{order.customer_phone || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{order.customer_email || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Address:</span>
                                    <span className="font-medium text-right">{order.delivery_address || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Items:</span>
                                    <span className="font-medium text-right">{order.items_summary || 'No items'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium text-green-600">${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Driver:</span>
                                    <span className="font-medium">{order.driver_name || 'Not assigned'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Order Time:</span>
                                    <span className="font-medium">{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3 pt-4">
                                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                  Update Order Status
                                </button>
                                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  Contact Customer
                                </button>
                                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  Assign Driver
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      >
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">Edit</button>
                      {order.status === 'pending' && (
                        <button className="text-red-600 hover:text-red-900 transition-colors">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Features Page Component
const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Navigation />
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-unbounded text-5xl md:text-6xl font-light text-white mb-8 text-center">
            Features
          </h1>
          <p className="font-manrope text-lg text-white/80 mb-12 text-center leading-relaxed">
            Discover how DoorBis transforms cannabis commerce with cutting-edge technology
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-unbounded text-xl text-white mb-3">QR Storefront</h3>
              <p className="font-manrope text-white/70 text-sm">No app downloads needed. Customers scan QR codes to access your digital storefront instantly.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-unbounded text-xl text-white mb-3">Local Driver Network</h3>
              <p className="font-manrope text-white/70 text-sm">Connect with verified local drivers for same-day delivery across your service area.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-unbounded text-xl text-white mb-3">Analytics Dashboard</h3>
              <p className="font-manrope text-white/70 text-sm">Track sales, inventory, and customer insights with real-time analytics.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-unbounded text-xl text-white mb-3">Secure Payments</h3>
              <p className="font-manrope text-white/70 text-sm">Integrated payment processing with compliance and security built-in.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="font-unbounded text-xl text-white mb-3">Branded Storefront</h3>
              <p className="font-manrope text-white/70 text-sm">Each dispensary gets a unique subdomain with custom branding and styling.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-unbounded text-xl text-white mb-3">Mobile Optimized</h3>
              <p className="font-manrope text-white/70 text-sm">Perfect experience on all devices without requiring app installations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dispensaries Page Component
const DispensariesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Navigation />
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-unbounded text-5xl md:text-6xl font-light text-white mb-8">
            For Dispensaries
          </h1>
          <p className="font-manrope text-lg text-white/80 mb-12 leading-relaxed">
            Transform your cannabis business with digital commerce solutions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="font-unbounded text-2xl text-green-400 mb-6">Why Choose DoorBis?</h3>
              <ul className="space-y-4 font-manrope text-white/80">
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>No app development costs - instant QR-based storefront</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Integrated local driver network for deliveries</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Real-time inventory and sales analytics</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Compliant payment processing built-in</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Custom branding with kush.doorbis.com/yourstore</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-unbounded text-2xl text-green-400 mb-6">Getting Started</h3>
              <div className="space-y-6">
                <div className="glass-card p-4 rounded-lg">
                  <div className="font-semibold text-white mb-2">1. Sign Up</div>
                  <div className="text-white/70 text-sm">Create your dispensary account in minutes</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="font-semibold text-white mb-2">2. Setup Inventory</div>
                  <div className="text-white/70 text-sm">Upload your products and set pricing</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="font-semibold text-white mb-2">3. Go Live</div>
                  <div className="text-white/70 text-sm">Start taking orders immediately</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <Link
              to="/dashboard"
              className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
            >
              Start Your Store →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Drivers Page Component
const DriversPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Navigation />
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-unbounded text-5xl md:text-6xl font-light text-white mb-8">
            For Drivers
          </h1>
          <p className="font-manrope text-lg text-white/80 mb-12 leading-relaxed">
            Join the local cannabis delivery network and earn with flexible scheduling
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-6 rounded-xl">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="font-unbounded text-xl text-white mb-3">Competitive Pay</h3>
              <p className="font-manrope text-white/70 text-sm">Earn competitive rates plus tips for each delivery in your area.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="text-3xl mb-4">⏰</div>
              <h3 className="font-unbounded text-xl text-white mb-3">Flexible Schedule</h3>
              <p className="font-manrope text-white/70 text-sm">Work when you want, where you want. Set your own availability.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-unbounded text-xl text-white mb-3">Safe & Legal</h3>
              <p className="font-manrope text-white/70 text-sm">All deliveries are compliant with local cannabis regulations.</p>
            </div>
          </div>
          
          <div className="text-left max-w-2xl mx-auto">
            <h3 className="font-unbounded text-2xl text-green-400 mb-6 text-center">Requirements</h3>
            <ul className="space-y-3 font-manrope text-white/80">
              <li className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>Valid driver's license and insurance</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>Reliable vehicle for deliveries</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>18+ years old with clean background check</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-green-400">✓</span>
                <span>Cannabis delivery license (where required)</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-12">
            <button className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25">
              Apply to Drive →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pricing Page Component
const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Navigation />
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-unbounded text-5xl md:text-6xl font-light text-white mb-8">
            Pricing
          </h1>
          <p className="font-manrope text-lg text-white/80 mb-12 leading-relaxed">
            Simple, transparent pricing that grows with your business
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-xl">
              <h3 className="font-unbounded text-2xl text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-green-400 mb-6">$99<span className="text-lg text-white/60">/mo</span></div>
              <ul className="space-y-3 font-manrope text-white/80 text-sm mb-8">
                <li>✓ QR Storefront</li>
                <li>✓ Up to 100 products</li>
                <li>✓ Basic analytics</li>
                <li>✓ Payment processing</li>
                <li>✓ Email support</li>
              </ul>
              <button className="w-full border border-green-400 text-green-400 px-6 py-3 rounded-lg hover:bg-green-400 hover:text-black transition-colors">
                Start Free Trial
              </button>
            </div>
            
            <div className="glass-card p-8 rounded-xl border-2 border-green-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="font-unbounded text-2xl text-white mb-4">Professional</h3>
              <div className="text-4xl font-bold text-green-400 mb-6">$199<span className="text-lg text-white/60">/mo</span></div>
              <ul className="space-y-3 font-manrope text-white/80 text-sm mb-8">
                <li>✓ Everything in Starter</li>
                <li>✓ Unlimited products</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Driver network access</li>
                <li>✓ Priority support</li>
                <li>✓ Custom branding</li>
              </ul>
              <button className="w-full bg-green-400 text-black px-6 py-3 rounded-lg hover:bg-green-300 transition-colors">
                Start Free Trial
              </button>
            </div>
            
            <div className="glass-card p-8 rounded-xl">
              <h3 className="font-unbounded text-2xl text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-green-400 mb-6">Custom</div>
              <ul className="space-y-3 font-manrope text-white/80 text-sm mb-8">
                <li>✓ Everything in Professional</li>
                <li>✓ Multi-location support</li>
                <li>✓ API access</li>
                <li>✓ Dedicated account manager</li>
                <li>✓ 24/7 phone support</li>
                <li>✓ Custom integrations</li>
              </ul>
              <button className="w-full border border-green-400 text-green-400 px-6 py-3 rounded-lg hover:bg-green-400 hover:text-black transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
          
          <div className="mt-12 text-white/60 text-sm">
            <p>All plans include 14-day free trial • No setup fees • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Page Component
const FAQPage = () => {
  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "You can have your QR storefront live within 24 hours of signing up. Simply upload your products, set your pricing, and start taking orders."
    },
    {
      question: "Do my customers need to download an app?",
      answer: "No! That's the beauty of DoorBis. Customers simply scan a QR code to access your mobile-optimized storefront directly in their browser."
    },
    {
      question: "How does the driver network work?",
      answer: "We connect you with verified local drivers in your area. When you receive an order, nearby drivers are notified and can accept the delivery job."
    },
    {
      question: "Is the platform compliant with cannabis regulations?",
      answer: "Yes, DoorBis is built with compliance in mind. We ensure all transactions and deliveries meet local cannabis regulations and licensing requirements."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support all major payment methods including credit cards, debit cards, and digital wallets, with secure processing and compliance built-in."
    },
    {
      question: "Can I customize my storefront?",
      answer: "Absolutely! Each dispensary gets custom branding, and Professional+ plans include advanced customization options for your storefront appearance."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Navigation />
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-unbounded text-5xl md:text-6xl font-light text-white mb-8 text-center">
            FAQ
          </h1>
          <p className="font-manrope text-lg text-white/80 mb-12 text-center leading-relaxed">
            Common questions about DoorBis cannabis commerce platform
          </p>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card p-6 rounded-xl">
                <h3 className="font-unbounded text-lg text-white mb-3">{faq.question}</h3>
                <p className="font-manrope text-white/80 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="font-manrope text-white/80 mb-6">Still have questions?</p>
            <button className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SignUp Page Component  
const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <Navigation />
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 rounded-xl">
            <h1 className="font-unbounded text-3xl text-white mb-6 text-center">
              Join DoorBis
            </h1>
            <p className="font-manrope text-white/80 text-center mb-8">
              Start your cannabis commerce journey today
            </p>
            
            <form className="space-y-6">
              <div>
                <label className="block font-manrope text-white/80 text-sm mb-2">Dispensary Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="Your dispensary name"
                />
              </div>
              
              <div>
                <label className="block font-manrope text-white/80 text-sm mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block font-manrope text-white/80 text-sm mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="Create a secure password"
                />
              </div>
              
              <div>
                <label className="block font-manrope text-white/80 text-sm mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-green-400 text-black px-6 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-colors"
              >
                Create Account
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="font-manrope text-white/60 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-green-400 hover:text-green-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Product Form Component
const AddProductForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Flower',
    strain: 'Hybrid',
    thc_percentage: '',
    cbd_percentage: '',
    price: '',
    stock: '',
    description: '',
    image_emoji: '🌿'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">{formData.image_emoji}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Product</h3>
        <p className="text-gray-600">Add a new cannabis product to your inventory</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              placeholder="e.g., Blue Dream" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option>Flower</option>
              <option>Edibles</option>
              <option>Pre-Rolls</option>
              <option>Concentrates</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Strain Type</label>
            <select 
              name="strain"
              value={formData.strain}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option>Indica</option>
              <option>Sativa</option>
              <option>Hybrid</option>
              <option>N/A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">THC %</label>
            <input 
              type="text" 
              name="thc_percentage"
              value={formData.thc_percentage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              placeholder="e.g., 18-24%" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CBD %</label>
            <input 
              type="text" 
              name="cbd_percentage"
              value={formData.cbd_percentage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              placeholder="e.g., 0.1%" 
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              placeholder="45.00" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
            <input 
              type="number" 
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
              placeholder="25" 
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" 
            rows="3" 
            placeholder="Product description..."
          ></textarea>
        </div>
      </div>
      
      <div className="space-y-3 pt-4">
        <button 
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Product
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Edit Product Form Component
const EditProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    category: product.category || 'Flower',
    strain: product.strain || 'Hybrid',
    thc_percentage: product.thc_percentage || '',
    cbd_percentage: product.cbd_percentage || '',
    price: product.price || '',
    stock: product.stock || '',
    description: product.description || '',
    status: product.status || 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">{product.image_emoji}</div>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500">{product.category} • {product.strain}</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Current Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">THC:</span>
            <span className="font-medium ml-2">{product.thc_percentage}</span>
          </div>
          <div>
            <span className="text-gray-600">CBD:</span>
            <span className="font-medium ml-2">{product.cbd_percentage}</span>
          </div>
          <div>
            <span className="text-gray-600">Price:</span>
            <span className="font-medium ml-2">${product.price}</span>
          </div>
          <div>
            <span className="text-gray-600">Stock:</span>
            <span className="font-medium ml-2">{product.stock} units</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <input 
              type="number" 
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3 pt-4">
        <button 
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Update Product
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Products Catalog Component
const ProductsCatalog = ({ setSlideCard }) => {
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchProductStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await ApiService.getProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      setError('Error loading products');
    }
  };

  const fetchProductStats = async () => {
    try {
      const result = await ApiService.getProductStats();
      if (result.success) {
        setProductStats(result.data);
      }
    } catch (error) {
      console.error('Error loading product stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const result = await ApiService.createProduct(productData);
      if (result.success) {
        setProducts([...products, result.data]);
        setSlideCard({ isOpen: false });
        fetchProductStats();
      } else {
        alert('Failed to create product: ' + result.error);
      }
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const result = await ApiService.updateProduct(productId, productData);
      if (result.success) {
        setProducts(products.map(p => p.id === productId ? result.data : p));
        setSlideCard({ isOpen: false });
      } else {
        alert('Failed to update product: ' + result.error);
      }
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await ApiService.deleteProduct(productId);
        if (result.success) {
          setProducts(products.filter(p => p.id !== productId));
          fetchProductStats();
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => { setError(''); fetchProducts(); fetchProductStats(); }}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const categories = ['All', 'Flower', 'Edibles', 'Pre-Rolls', 'Concentrates', 'Accessories'];

  return (
    <div className="space-y-6">
      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Total Products</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">127</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M6 7h12" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Active Products</div>
              <div className="text-2xl font-bold text-green-600 mt-1">98</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Low Stock</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">12</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Out of Stock</div>
              <div className="text-2xl font-bold text-red-600 mt-1">17</div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Product Catalog</h3>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              onClick={() => setSlideCard({
                isOpen: true,
                title: 'Add New Product',
                content: (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter product name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Flower</option>
                        <option>Edibles</option>
                        <option>Pre-Rolls</option>
                        <option>Concentrates</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Strain Type</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Indica</option>
                        <option>Sativa</option>
                        <option>Hybrid</option>
                        <option>N/A</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">THC %</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="20-24%" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CBD %</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="0.1%" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="$45.00" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
                        <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="25" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" placeholder="Product description..."></textarea>
                    </div>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Add Product
                    </button>
                  </div>
                )
              })}
            >
              Add Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">THC/CBD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{product.image}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.strain}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.thc} / {product.cbd}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 transition-colors mr-3"
                      onClick={() => setSlideCard({
                        isOpen: true,
                        title: `Edit ${product.name}`,
                        content: (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-4xl mb-2">{product.image}</div>
                              <h3 className="text-lg font-semibold">{product.name}</h3>
                              <p className="text-gray-500">{product.id}</p>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium">{product.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Strain:</span>
                                <span className="font-medium">{product.strain}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">THC:</span>
                                <span className="font-medium">{product.thc}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">CBD:</span>
                                <span className="font-medium">{product.cbd}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Price:</span>
                                <span className="font-medium text-green-600">{product.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Stock:</span>
                                <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {product.stock} units
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3 pt-4">
                              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                Edit Product
                              </button>
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Update Stock
                              </button>
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                View Analytics
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    >
                      Edit
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 transition-colors mr-3">Stock</button>
                    <button className="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Storefront Settings Component
const StorefrontSettings = ({ setSlideCard }) => {
  return (
    <div className="space-y-6">
      {/* Storefront Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">QR Scans Today</div>
              <div className="text-2xl font-bold text-green-600 mt-1">245</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Site Visitors</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">1,892</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Conversion Rate</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">8.4%</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Avg. Order Value</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">$67.50</div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Storefront Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="Green Valley Dispensary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" defaultValue="Premium cannabis dispensary serving Los Angeles with the finest selection of flowers, edibles, and concentrates."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store URL</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  kush.doorbis.com/
                </span>
                <input type="text" className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2" defaultValue="green-valley" />
              </div>
            </div>
            <button 
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setSlideCard({
                isOpen: true,
                title: 'Preview Your Storefront',
                content: (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                      <div className="text-6xl mb-4">🌿</div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Green Valley Dispensary</h2>
                      <p className="text-gray-600 mb-4">Premium cannabis dispensary serving Los Angeles</p>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-lg p-3">
                            <div className="text-2xl mb-2">🌿</div>
                            <div className="font-medium">Blue Dream</div>
                            <div className="text-green-600">$45.00</div>
                          </div>
                          <div className="border rounded-lg p-3">
                            <div className="text-2xl mb-2">🌿</div>
                            <div className="font-medium">OG Kush</div>
                            <div className="text-green-600">$50.00</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Visit Live Site
                    </button>
                  </div>
                )
              })}
            >
              Preview Storefront
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code & Marketing</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-4xl">📱</div>
              </div>
              <p className="text-sm text-gray-600 mb-4">QR Code for your storefront</p>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setSlideCard({
                  isOpen: true,
                  title: 'Download QR Code',
                  content: (
                    <div className="space-y-4 text-center">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <div className="text-6xl">📱</div>
                      </div>
                      <h3 className="text-lg font-semibold">Green Valley Dispensary QR</h3>
                      <p className="text-gray-600">Customers scan this to access your digital storefront</p>
                      <div className="space-y-2">
                        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Download PNG
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          Download SVG
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          Print Ready PDF
                        </button>
                      </div>
                    </div>
                  )
                })}
              >
                Download QR Code
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Message</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" placeholder="Add a custom message that appears when customers scan your QR code"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
              <div className="space-y-2">
                <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Instagram URL" />
                <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Facebook URL" />
                <input type="url" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Twitter URL" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
            <div key={day} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked={index < 6} />
                <span className="font-medium text-gray-900">{day}</span>
              </div>
              <div className="flex space-x-2">
                <input type="time" className="border border-gray-300 rounded px-2 py-1 text-sm" defaultValue="09:00" />
                <span className="text-gray-500">-</span>
                <input type="time" className="border border-gray-300 rounded px-2 py-1 text-sm" defaultValue="21:00" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Drivers Management Component
const DriversManagement = ({ setSlideCard }) => {
  const drivers = [
    { id: 'DRV-001', name: 'Mike Rodriguez', phone: '(555) 123-4567', email: 'mike@email.com', status: 'active', orders: 28, rating: 4.9, earnings: '$1,247', location: 'Downtown LA', vehicle: '2022 Honda Civic' },
    { id: 'DRV-002', name: 'Lisa Anderson', phone: '(555) 234-5678', email: 'lisa@email.com', status: 'on-delivery', orders: 45, rating: 4.8, earnings: '$2,156', location: 'Beverly Hills', vehicle: '2021 Toyota Prius' },
    { id: 'DRV-003', name: 'Carlos Martinez', phone: '(555) 345-6789', email: 'carlos@email.com', status: 'offline', orders: 62, rating: 4.7, earnings: '$2,894', location: 'Santa Monica', vehicle: '2020 Tesla Model 3' },
    { id: 'DRV-004', name: 'Jennifer Lee', phone: '(555) 456-7890', email: 'jennifer@email.com', status: 'active', orders: 33, rating: 4.9, earnings: '$1,567', location: 'Hollywood', vehicle: '2023 Nissan Sentra' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-delivery': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Driver Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Total Drivers</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">23</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Active Now</div>
              <div className="text-2xl font-bold text-green-600 mt-1">18</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">On Delivery</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">7</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9m-6-9a8 8 0 1116 0v9" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Avg Rating</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">4.8</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Driver Management</h3>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Drivers</option>
              <option>Active</option>
              <option>On Delivery</option>
              <option>Offline</option>
            </select>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              onClick={() => setSlideCard({
                isOpen: true,
                title: 'Add New Driver',
                content: (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="john@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="2022 Honda Civic" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="D1234567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Downtown LA</option>
                        <option>Beverly Hills</option>
                        <option>Santa Monica</option>
                        <option>Hollywood</option>
                        <option>West Hollywood</option>
                      </select>
                    </div>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Add Driver
                    </button>
                  </div>
                )
              })}
            >
              Add Driver
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.phone}</div>
                    <div className="text-sm text-gray-500">{driver.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.earnings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 transition-colors mr-3"
                      onClick={() => setSlideCard({
                        isOpen: true,
                        title: `Driver ${driver.name}`,
                        content: (
                          <div className="space-y-6">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                                {driver.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <h3 className="text-lg font-semibold">{driver.name}</h3>
                              <p className="text-gray-500">{driver.id}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="font-medium">{driver.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">{driver.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Vehicle:</span>
                                  <span className="font-medium">{driver.vehicle}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Location:</span>
                                  <span className="font-medium">{driver.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Orders:</span>
                                  <span className="font-medium">{driver.orders}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Rating:</span>
                                  <span className="font-medium text-yellow-600">{driver.rating} ⭐</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Earnings:</span>
                                  <span className="font-medium text-green-600">{driver.earnings}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-4">
                              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                View Live Location
                              </button>
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Assign Order
                              </button>
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Send Message
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    >
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 transition-colors mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900 transition-colors">Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Payments Management Component
const PaymentsManagement = ({ setSlideCard }) => {
  const transactions = [
    { id: 'TXN-001', order: '#ORD-001', customer: 'Sarah Johnson', amount: '$127.50', fee: '$3.82', net: '$123.68', status: 'completed', method: 'Card', date: '2 hours ago', stripeId: 'pi_1234567890' },
    { id: 'TXN-002', order: '#ORD-002', customer: 'Mike Chen', amount: '$89.00', fee: '$2.67', net: '$86.33', status: 'completed', method: 'Card', date: '45 minutes ago', stripeId: 'pi_1234567891' },
    { id: 'TXN-003', order: '#ORD-003', customer: 'Emma Wilson', amount: '$156.25', fee: '$4.69', net: '$151.56', status: 'pending', method: 'Card', date: '30 minutes ago', stripeId: 'pi_1234567892' },
    { id: 'TXN-004', order: '#ORD-004', customer: 'David Brown', amount: '$203.75', fee: '$6.11', net: '$197.64', status: 'completed', method: 'Card', date: '15 minutes ago', stripeId: 'pi_1234567893' },
    { id: 'TXN-005', order: '#ORD-005', customer: 'Jessica Taylor', amount: '$178.00', fee: '$5.34', net: '$172.66', status: 'refunded', method: 'Card', date: '1 hour ago', stripeId: 'pi_1234567894' },
  ];

  const payouts = [
    { id: 'PO-001', amount: '$2,847.50', fee: '$12.50', net: '$2,835.00', status: 'paid', date: 'Today', account: '****1234', transactions: 45 },
    { id: 'PO-002', amount: '$3,156.25', fee: '$13.75', net: '$3,142.50', status: 'pending', date: 'Tomorrow', account: '****1234', transactions: 52 },
    { id: 'PO-003', amount: '$2,234.75', fee: '$11.25', net: '$2,223.50', status: 'paid', date: 'Yesterday', account: '****1234', transactions: 38 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600 mt-1">$24,789</div>
              <div className="text-sm text-green-600 mt-1">+12.5% from last month</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Processing Fees</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">$743</div>
              <div className="text-sm text-gray-500 mt-1">2.99% average</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Pending Payouts</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">$3,142</div>
              <div className="text-sm text-gray-500 mt-1">Next: Tomorrow</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Refunds</div>
              <div className="text-2xl font-bold text-red-600 mt-1">$356</div>
              <div className="text-sm text-gray-500 mt-1">3 this month</div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payment Configuration</h3>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            onClick={() => setSlideCard({
              isOpen: true,
              title: 'Stripe Integration Settings',
              content: (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe Configuration</h3>
                    <p className="text-gray-600">Manage your payment processing settings</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Account ID</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="acct_1234567890" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="pk_live_51..." readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Processing Rate</label>
                      <div className="flex items-center space-x-2">
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2.9" />
                        <span className="text-gray-500">% + $0.30</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Update Settings
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Test Connection
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      View Stripe Dashboard
                    </button>
                  </div>
                </div>
              )
            })}
          >
            Configure Stripe
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Credit & Debit Cards</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Digital Wallets</div>
                  <div className="text-sm text-gray-500">Apple Pay, Google Pay</div>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Processing Rate</h4>
              <div className="text-2xl font-bold text-gray-900">2.9% + $0.30</div>
              <div className="text-sm text-gray-500 mt-1">Per successful transaction</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Payout Schedule</h4>
              <div className="text-lg font-semibold text-gray-900">Daily</div>
              <div className="text-sm text-gray-500 mt-1">Next payout: Tomorrow</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Transactions</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                    <div className="text-sm text-gray-500">{transaction.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.customer}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{transaction.net}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 transition-colors mr-3"
                      onClick={() => setSlideCard({
                        isOpen: true,
                        title: `Transaction ${transaction.id}`,
                        content: (
                          <div className="space-y-6">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{transaction.id}</h3>
                              <p className="text-gray-600">Transaction Details</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Customer:</span>
                                  <span className="font-medium">{transaction.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Order:</span>
                                  <span className="font-medium">{transaction.order}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="font-medium">{transaction.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Processing Fee:</span>
                                  <span className="font-medium">{transaction.fee}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Net Amount:</span>
                                  <span className="font-medium text-green-600">{transaction.net}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment Method:</span>
                                  <span className="font-medium">{transaction.method}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Stripe ID:</span>
                                  <span className="font-medium text-sm">{transaction.stripeId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-4">
                              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                View in Stripe Dashboard
                              </button>
                              {transaction.status === 'completed' && (
                                <button className="w-full border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                  Issue Refund
                                </button>
                              )}
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Download Receipt
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    >
                      View
                    </button>
                    {transaction.status === 'completed' && (
                      <button className="text-red-600 hover:text-red-900 transition-colors">Refund</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payouts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payouts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.map((payout, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payout.id}</div>
                    <div className="text-sm text-gray-500">{payout.transactions} transactions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{payout.net}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Customers Management Component  
const CustomersManagement = ({ setSlideCard }) => {
  const [customers, setCustomers] = useState([]);
  const [customerStats, setCustomerStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      const result = await ApiService.getCustomers();
      if (result.success) {
        setCustomers(result.data || []);
      } else {
        setError('Failed to load customers');
      }
    } catch (error) {
      setError('Error loading customers');
      console.error('Customers fetch error:', error);
    }
  };

  const fetchCustomerStats = async () => {
    try {
      const result = await ApiService.getCustomerStats();
      if (result.success) {
        setCustomerStats(result.data || {});
      }
    } catch (error) {
      console.error('Customer stats fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => { setError(''); fetchCustomers(); fetchCustomerStats(); }}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoyaltyColor = (loyalty) => {
    switch(loyalty) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Total Customers</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{customerStats.total_customers || 0}</div>
              <div className="text-sm text-green-600 mt-1">+{customerStats.new_customers || 0} this month</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Active Customers</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{customerStats.active_customers || 0}</div>
              <div className="text-sm text-gray-500 mt-1">{customerStats.active_percentage || 0}% of total</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Average Order Value</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">${customerStats.avg_order_value ? customerStats.avg_order_value.toFixed(2) : '0.00'}</div>
              <div className="text-sm text-gray-500 mt-1">Per customer</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Lifetime Value</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">${customerStats.lifetime_value ? customerStats.lifetime_value.toFixed(2) : '0.00'}</div>
              <div className="text-sm text-gray-500 mt-1">Total revenue</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Management</h3>
        </div>
        <div className="overflow-x-auto">
          {customers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer, index) => (
                  <tr key={customer.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">Joined: {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.orders_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.total_spent ? customer.total_spent.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status || 'active')}`}>
                        {customer.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-green-600 hover:text-green-900 transition-colors"
                          onClick={() => setSlideCard({
                            isOpen: true,
                            title: `Customer ${customer.name}`,
                            content: (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Name:</span>
                                      <span className="font-medium">{customer.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Email:</span>
                                      <span className="font-medium">{customer.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Phone:</span>
                                      <span className="font-medium">{customer.phone || 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Order History</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Orders:</span>
                                      <span className="font-medium">{customer.orders_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Spent:</span>
                                      <span className="font-medium text-green-600">${customer.total_spent ? customer.total_spent.toFixed(2) : '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Average Order:</span>
                                      <span className="font-medium">${customer.avg_order_value ? customer.avg_order_value.toFixed(2) : '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Last Order:</span>
                                      <span className="font-medium">{customer.last_order ? new Date(customer.last_order).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-3 pt-4">
                                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                    View Order History
                                  </button>
                                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    Send Message
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        >
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No customers available</p>
              <button 
                onClick={() => { fetchCustomers(); fetchCustomerStats(); }} 
                className="mt-2 text-green-600 hover:text-green-800"
              >
                Refresh Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsReports = ({ setSlideCard }) => {
              isOpen: true,
              title: 'Loyalty Program Settings',
              content: (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loyalty Program Configuration</h3>
                    <p className="text-gray-600">Manage loyalty tiers and rewards</p>
                  </div>
                  
                  <div className="space-y-4">
                    {loyaltyPrograms.map((program, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-900">{program.tier}</h4>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${program.color}`}>
                            {program.customers} customers
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Minimum Spent:</span>
                            <input type="text" className="w-20 text-sm border border-gray-300 rounded px-2 py-1" defaultValue={program.minSpent} />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Discount:</span>
                            <input type="text" className="w-20 text-sm border border-gray-300 rounded px-2 py-1" defaultValue={program.discount} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Update Loyalty Programs
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Send Loyalty Rewards
                    </button>
                  </div>
                </div>
              )
            })}
          >
            Manage Loyalty
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loyaltyPrograms.map((program, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">{program.tier}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${program.color}`}>
                  {program.customers}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">Min: {program.minSpent}</div>
                <div className="text-sm text-gray-600">Discount: {program.discount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Customer Database</h3>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Customers</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>VIP</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Loyalty</option>
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
              <option>Platinum</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loyalty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.orders}</div>
                    <div className="text-sm text-gray-500">Avg: {customer.avgOrder}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">{customer.totalSpent}</div>
                    <div className="text-sm text-gray-500">Last: {customer.lastOrder}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyColor(customer.loyalty)}`}>
                      {customer.loyalty.charAt(0).toUpperCase() + customer.loyalty.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 transition-colors mr-3"
                      onClick={() => setSlideCard({
                        isOpen: true,
                        title: `Customer ${customer.name}`,
                        content: (
                          <div className="space-y-6">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <h3 className="text-lg font-semibold">{customer.name}</h3>
                              <p className="text-gray-500">{customer.id}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span className="font-medium">{customer.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="font-medium">{customer.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Member Since:</span>
                                  <span className="font-medium">{customer.joined}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Order History</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Orders:</span>
                                  <span className="font-medium">{customer.orders}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Spent:</span>
                                  <span className="font-medium text-green-600">{customer.totalSpent}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Avg Order:</span>
                                  <span className="font-medium">{customer.avgOrder}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Last Order:</span>
                                  <span className="font-medium">{customer.lastOrder}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Loyalty Tier:</span>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyColor(customer.loyalty)}`}>
                                    {customer.loyalty.charAt(0).toUpperCase() + customer.loyalty.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-4">
                              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                View All Orders
                              </button>
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Send Message
                              </button>
                              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Update Loyalty Tier
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    >
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 transition-colors mr-3">Message</button>
                    <button className="text-purple-600 hover:text-purple-900 transition-colors">Rewards</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics & Reports Component
const AnalyticsReports = ({ setSlideCard }) => {
  const analyticsData = {
    salesMetrics: [
      { period: 'Today', revenue: '$2,847', orders: 23, avgOrder: '$123.78', change: '+12.5%' },
      { period: 'Yesterday', revenue: '$2,534', orders: 19, avgOrder: '$133.37', change: '+8.2%' },
      { period: 'This Week', revenue: '$18,493', orders: 145, avgOrder: '$127.54', change: '+15.3%' },
      { period: 'Last Week', revenue: '$16,021', orders: 132, avgOrder: '$121.37', change: '+5.1%' },
      { period: 'This Month', revenue: '$84,329', orders: 647, avgOrder: '$130.31', change: '+18.7%' },
      { period: 'Last Month', revenue: '$71,045', orders: 578, avgOrder: '$122.84', change: '+12.1%' },
    ],
    topProducts: [
      { name: 'Blue Dream', sales: 145, revenue: '$6,525', percentage: '18.5%' },
      { name: 'OG Kush', sales: 132, revenue: '$6,600', percentage: '17.2%' },
      { name: 'Sativa Mix', sales: 89, revenue: '$4,272', percentage: '11.8%' },
      { name: 'CBD Gummies', sales: 78, revenue: '$1,950', percentage: '9.2%' },
      { name: 'Pre-Roll Pack', sales: 67, revenue: '$2,345', percentage: '7.8%' },
    ],
    deliveryMetrics: [
      { metric: 'Avg Delivery Time', value: '28 min', target: '30 min', status: 'good' },
      { metric: 'On-Time Delivery', value: '94.2%', target: '90%', status: 'excellent' },
      { metric: 'Customer Satisfaction', value: '4.8/5', target: '4.5/5', status: 'excellent' },
      { metric: 'Delivery Success Rate', value: '98.7%', target: '95%', status: 'excellent' },
    ],
    customerInsights: [
      { metric: 'New Customers', value: '45', period: 'This Month', change: '+15.3%' },
      { metric: 'Returning Customers', value: '67%', period: 'Overall', change: '+8.2%' },
      { metric: 'Customer Lifetime Value', value: '$847', period: 'Average', change: '+12.1%' },
      { metric: 'Churn Rate', value: '2.3%', period: 'Monthly', change: '-0.5%' },
    ],
    referralData: [
      { source: 'Word of Mouth', customers: 89, percentage: '32.1%' },
      { source: 'Social Media', customers: 67, percentage: '24.1%' },
      { source: 'Google Search', customers: 45, percentage: '16.2%' },
      { source: 'Direct', customers: 34, percentage: '12.3%' },
      { source: 'Referral Program', customers: 28, percentage: '10.1%' },
      { source: 'Other', customers: 14, percentage: '5.2%' },
    ]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
              <div className="text-2xl font-bold text-green-600 mt-1">$84,329</div>
              <div className="text-sm text-green-600 mt-1">+18.7% from last month</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Avg Order Value</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">$130.31</div>
              <div className="text-sm text-blue-600 mt-1">+6.2% from last month</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Customer Satisfaction</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">4.8/5</div>
              <div className="text-sm text-purple-600 mt-1">Based on 1,247 reviews</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Delivery Performance</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">94.2%</div>
              <div className="text-sm text-orange-600 mt-1">On-time delivery rate</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M6 7h12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            onClick={() => setSlideCard({
              isOpen: true,
              title: 'Detailed Sales Analytics',
              content: (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales Analytics</h3>
                    <p className="text-gray-600">Comprehensive sales performance metrics</p>
                  </div>
                  
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-green-600 font-semibold text-lg">Interactive Sales Chart</div>
                      <div className="text-sm text-gray-500 mt-2">Revenue trends, order patterns, and growth metrics</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600">Peak Sales Hour</div>
                      <div className="text-lg font-bold text-gray-900">2:00 PM - 4:00 PM</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600">Best Sales Day</div>
                      <div className="text-lg font-bold text-gray-900">Saturday</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Export Detailed Report
                  </button>
                </div>
              )
            })}
          >
            View Details
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.salesMetrics.map((metric, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{metric.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.avgOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{metric.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products & Delivery Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">{product.revenue}</div>
                  <div className="text-sm text-gray-500">{product.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
          <div className="space-y-4">
            {analyticsData.deliveryMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{getStatusIcon(metric.status)}</div>
                  <div>
                    <div className="font-medium text-gray-900">{metric.metric}</div>
                    <div className="text-sm text-gray-500">Target: {metric.target}</div>
                  </div>
                </div>
                <div className={`text-right font-medium ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Insights & Referral Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
          <div className="space-y-4">
            {analyticsData.customerInsights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{insight.metric}</div>
                  <div className="text-sm text-gray-500">{insight.period}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{insight.value}</div>
                  <div className="text-sm text-green-600">{insight.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Acquisition</h3>
          <div className="space-y-4">
            {analyticsData.referralData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{source.source}</div>
                  <div className="text-sm text-gray-500">{source.customers} customers</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-blue-600">{source.percentage}</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: source.percentage }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Support Center Component
const SupportCenter = ({ setSlideCard }) => {
  const tickets = [
    { id: 'TKT-001', customer: 'Sarah Johnson', subject: 'Order not delivered', priority: 'high', status: 'open', created: '2 hours ago', assigned: 'John Doe', category: 'delivery' },
    { id: 'TKT-002', customer: 'Mike Chen', subject: 'Product quality issue', priority: 'medium', status: 'in-progress', created: '4 hours ago', assigned: 'Jane Smith', category: 'product' },
    { id: 'TKT-003', customer: 'Emma Wilson', subject: 'Payment refund request', priority: 'high', status: 'open', created: '1 hour ago', assigned: 'Unassigned', category: 'payment' },
    { id: 'TKT-004', customer: 'David Brown', subject: 'Website login issue', priority: 'low', status: 'resolved', created: '1 day ago', assigned: 'Tech Support', category: 'technical' },
    { id: 'TKT-005', customer: 'Jessica Taylor', subject: 'Order modification needed', priority: 'medium', status: 'in-progress', created: '6 hours ago', assigned: 'John Doe', category: 'order' },
  ];

  const knowledgeBase = [
    { id: 'KB-001', title: 'How to track your order', category: 'Orders', views: 1245, helpful: 89 },
    { id: 'KB-002', title: 'Payment methods accepted', category: 'Payment', views: 892, helpful: 76 },
    { id: 'KB-003', title: 'Delivery time estimates', category: 'Delivery', views: 1034, helpful: 92 },
    { id: 'KB-004', title: 'Product quality guarantee', category: 'Products', views: 567, helpful: 85 },
    { id: 'KB-005', title: 'How to cancel an order', category: 'Orders', views: 734, helpful: 78 },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'delivery': return '🚚';
      case 'product': return '🌿';
      case 'payment': return '💳';
      case 'technical': return '🔧';
      case 'order': return '📋';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Open Tickets</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">23</div>
              <div className="text-sm text-gray-500 mt-1">5 high priority</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Avg Response Time</div>
              <div className="text-2xl font-bold text-green-600 mt-1">24 min</div>
              <div className="text-sm text-green-600 mt-1">-15% from last month</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Resolution Rate</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">94.2%</div>
              <div className="text-sm text-purple-600 mt-1">+2.1% from last month</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600">Satisfaction Score</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">4.6/5</div>
              <div className="text-sm text-orange-600 mt-1">Based on 234 reviews</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Live Chat Support</h3>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            onClick={() => setSlideCard({
              isOpen: true,
              title: 'Chat Settings',
              content: (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat Configuration</h3>
                    <p className="text-gray-600">Configure your live chat widget settings</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Enable Live Chat</span>
                      <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto-Reply</span>
                      <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">24/7 Support</span>
                      <input type="checkbox" className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                      <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" defaultValue="Hi! How can we help you today?"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="time" className="border border-gray-300 rounded-lg px-3 py-2" defaultValue="09:00" />
                        <input type="time" className="border border-gray-300 rounded-lg px-3 py-2" defaultValue="21:00" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Save Settings
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Test Chat Widget
                    </button>
                  </div>
                </div>
              )
            })}
          >
            Configure Chat
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Chat Widget Active</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Chats</span>
              <span className="text-sm font-medium text-gray-900">7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Waiting in Queue</span>
              <span className="text-sm font-medium text-gray-900">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="text-sm font-medium text-gray-900">2.3 min</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Recent Chat Messages</div>
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                <strong>Sarah J:</strong> "My order is delayed, when will it arrive?"
              </div>
              <div className="text-xs text-gray-600">
                <strong>Mike C:</strong> "Can I change my delivery address?"
              </div>
              <div className="text-xs text-gray-600">
                <strong>Emma W:</strong> "I need help with payment refund"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Tickets</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Create Ticket
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getCategoryIcon(ticket.category)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                        <div className="text-sm text-gray-500">{ticket.created}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.assigned}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-green-600 hover:text-green-900 transition-colors mr-3"
                      onClick={() => setSlideCard({
                        isOpen: true,
                        title: `Ticket ${ticket.id}`,
                        content: (
                          <div className="space-y-6">
                            <div className="text-center">
                              <div className="text-4xl mb-4">{getCategoryIcon(ticket.category)}</div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.id}</h3>
                              <p className="text-gray-600">{ticket.subject}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Ticket Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Customer:</span>
                                  <span className="font-medium">{ticket.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Priority:</span>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Assigned:</span>
                                  <span className="font-medium">{ticket.assigned}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Created:</span>
                                  <span className="font-medium">{ticket.created}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Category:</span>
                                  <span className="font-medium">{ticket.category}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Conversation</h4>
                              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                <div className="text-gray-600 mb-2">Customer message:</div>
                                <div className="text-gray-900">"{ticket.subject} - I need immediate assistance with this issue."</div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 pt-4">
                              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                                <option>Update Status</option>
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                              </select>
                              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" placeholder="Add a response..."></textarea>
                              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                Send Response
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    >
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 transition-colors mr-3">Assign</button>
                    <button className="text-red-600 hover:text-red-900 transition-colors">Close</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Add Article
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helpful</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {knowledgeBase.map((article, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{article.helpful}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 transition-colors mr-3">Edit</button>
                    <button className="text-blue-600 hover:text-blue-900 transition-colors mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Account Settings Component
const AccountSettings = ({ setSlideCard }) => {
  const teamMembers = [
    { id: 'USR-001', name: 'John Doe', email: 'john@greenvalley.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane@greenvalley.com', role: 'Manager', status: 'active', lastLogin: '4 hours ago' },
    { id: 'USR-003', name: 'Mike Johnson', email: 'mike@greenvalley.com', role: 'Support', status: 'active', lastLogin: '1 day ago' },
    { id: 'USR-004', name: 'Sarah Wilson', email: 'sarah@greenvalley.com', role: 'Viewer', status: 'inactive', lastLogin: '1 week ago' },
  ];

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Support': return 'bg-green-100 text-green-800';
      case 'Viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                GV
              </div>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                Change Profile Picture
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="Green Valley Dispensary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="john@greenvalley.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="(555) 123-4567" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" defaultValue="123 Main Street, Los Angeles, CA 90210"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="C11-0000123-LIC" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Pacific Time (PT)</option>
                <option>Mountain Time (MT)</option>
                <option>Central Time (CT)</option>
                <option>Eastern Time (ET)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  https://
                </span>
                <input type="text" className="flex-1 border border-gray-300 px-3 py-2" defaultValue="green-valley" />
                <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  .kush.doorbis.com
                </span>
              </div>
            </div>
            
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Order Notifications</div>
              <div className="text-sm text-gray-500">Get notified about new orders</div>
            </div>
            <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Payment Notifications</div>
              <div className="text-sm text-gray-500">Get notified about payments and payouts</div>
            </div>
            <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Support Tickets</div>
              <div className="text-sm text-gray-500">Get notified about customer support tickets</div>
            </div>
            <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Marketing Updates</div>
              <div className="text-sm text-gray-500">Receive product updates and tips</div>
            </div>
            <input type="checkbox" className="w-4 h-4 text-green-600" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">SMS Notifications</div>
              <div className="text-sm text-gray-500">Receive urgent notifications via SMS</div>
            </div>
            <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Add an extra layer of security</div>
            </div>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              onClick={() => setSlideCard({
                isOpen: true,
                title: 'Enable Two-Factor Authentication',
                content: (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable 2FA</h3>
                      <p className="text-gray-600">Secure your account with two-factor authentication</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <div className="text-4xl">📱</div>
                        </div>
                        <p className="text-sm text-gray-600">Scan this QR code with your authenticator app</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter verification code</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="123456" />
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Backup codes:</strong> Save these codes in a secure location. You can use them to access your account if you lose your phone.
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                )
              })}
            >
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-500">Update your password regularly</div>
            </div>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Active Sessions</div>
              <div className="text-sm text-gray-500">Manage your active login sessions</div>
            </div>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              View
            </button>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            onClick={() => setSlideCard({
              isOpen: true,
              title: 'Invite Team Member',
              content: (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Invite Team Member</h3>
                    <p className="text-gray-600">Add a new team member to your dispensary</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="colleague@email.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option>Admin</option>
                        <option>Manager</option>
                        <option>Support</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                      <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" placeholder="Welcome to the team!"></textarea>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Role Permissions:</strong>
                        <br />• Admin: Full access to all features
                        <br />• Manager: Can manage orders, products, and customers
                        <br />• Support: Can view and respond to tickets
                        <br />• Viewer: Read-only access to reports
                      </p>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Send Invitation
                  </button>
                </div>
              )
            })}
          >
            Invite Member
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 transition-colors mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900 transition-colors">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-6">Danger Zone</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-900">Export Data</div>
              <div className="text-sm text-red-600">Download all your data before making changes</div>
            </div>
            <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-900">Delete Account</div>
              <div className="text-sm text-red-600">Permanently delete your account and all data</div>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Main Component
const DashboardMain = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [slideCard, setSlideCard] = useState({ isOpen: false, title: '', content: null });

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardOverview setSlideCard={setSlideCard} />;
      case 'orders':
        return <OrdersManagement setSlideCard={setSlideCard} />;
      case 'products':
        return <ProductsCatalog setSlideCard={setSlideCard} />;
      case 'storefront':
        return <StorefrontSettings setSlideCard={setSlideCard} />;
      case 'drivers':
        return <DriversManagement setSlideCard={setSlideCard} />;
      case 'payments':
        return <PaymentsManagement setSlideCard={setSlideCard} />;
      case 'customers':
        return <CustomersManagement setSlideCard={setSlideCard} />;
      case 'analytics':
        return <AnalyticsReports setSlideCard={setSlideCard} />;
      case 'support':
        return <SupportCenter setSlideCard={setSlideCard} />;
      case 'settings':
        return <AccountSettings setSlideCard={setSlideCard} />;
      default:
        return <DashboardOverview setSlideCard={setSlideCard} />;
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-gray-50 text-gray-900">
      <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 ml-64">
        <DashboardTopBar activeSection={activeSection} />
        
        <main className="p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <SlidingCard
        isOpen={slideCard.isOpen}
        onClose={() => setSlideCard({ isOpen: false, title: '', content: null })}
        title={slideCard.title}
      >
        {slideCard.content}
      </SlidingCard>
    </div>
  );
};

// Home Page Component (keeping existing pages)
const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetAccess = () => {
    const modal = document.getElementById('access-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  };

  return (
    <div className="page-container">
      <Navigation />
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586275019508-fc4863eb2fd2')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-900/60 to-black/90"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-leaf floating-leaf-1"></div>
          <div className="floating-leaf floating-leaf-2"></div>
          <div className="floating-leaf floating-leaf-3"></div>
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-8 pt-32">
          <div className="max-w-2xl">
            <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="font-unbounded text-6xl md:text-7xl font-light tracking-tight leading-[1.1] text-white mb-6">
                Door to Dispensary.
                <span className="block text-green-400">No App Needed.</span>
              </h1>
              
              <p className="font-manrope text-lg text-white/80 mb-8 leading-relaxed">
                Let your dispensary go digital with a QR-powered storefront, local driver hiring, and zero downloads. 
                Each store gets a branded site under <span className="text-green-300 font-semibold">kush.doorbis.com</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25 text-center"
                >
                  View Dashboard →
                </Link>
                <button className="border border-white/40 text-white px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors">
                  Book Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 origin-right z-10">
        <div className="text-white/40 text-sm tracking-widest rotate-90 font-manrope">
          DISPENSARY FREEDOM / CHAPTER ONE
        </div>
      </div>
      
      <footer className="fixed bottom-4 left-6 text-xs text-white/50 font-manrope z-10">
        ✦ Built for Local Highs, 2025
      </footer>
      
      <div className="fixed bottom-4 right-6 text-xs text-white/50 font-manrope z-10">
        © DoorBis, 2025
      </div>
    </div>
  );
};



// Access Modal Component
const AccessModal = () => {
  return (
    <div id="access-modal" className="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-xl">
        <div className="text-center mb-6">
          <h2 className="font-unbounded text-2xl font-light text-white mb-2">Get Early Access</h2>
          <p className="font-manrope text-white/70 text-sm">Join the cannabis revolution</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block font-manrope text-white/80 text-sm mb-2">Store Name</label>
            <input 
              type="text" 
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
              placeholder="Your dispensary name"
            />
          </div>
          
          <div>
            <label className="block font-manrope text-white/80 text-sm mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block font-manrope text-white/80 text-sm mb-2">Stripe Account (Optional)</label>
            <input 
              type="text" 
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-green-400 transition-colors"
              placeholder="For payment processing"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-green-400 text-black px-6 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-colors"
            >
              Join Waitlist
            </button>
            <button 
              type="button"
              onClick={() => document.getElementById('access-modal').classList.add('hidden')}
              className="flex-1 border border-white/40 text-white px-6 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-green-100">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardMain /> : <Navigate to="/login" />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/dispensaries" element={<DispensariesPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;