import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

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
  const overviewCards = [
    { title: 'Total Orders', value: '1,247', change: '+12.5%', color: 'green', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { title: 'Revenue', value: '$84,329', change: '+8.2%', color: 'blue', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
    { title: 'Active Drivers', value: '23', change: '+2', color: 'purple', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Live Visitors', value: '127', change: '+5.1%', color: 'orange', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Sarah Johnson', items: '2x Blue Dream, 1x Edibles', status: 'delivered', amount: '$127.50', time: '2 hours ago' },
    { id: '#ORD-002', customer: 'Mike Chen', items: '1x OG Kush, 3x Pre-rolls', status: 'en-route', amount: '$89.00', time: '45 minutes ago' },
    { id: '#ORD-003', customer: 'Emma Wilson', items: '1x Sativa Mix, 2x Gummies', status: 'pending', amount: '$156.25', time: '30 minutes ago' },
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
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold">{card.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Month</span>
                      <span className="font-semibold">$72,145</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth</span>
                      <span className="text-green-600 font-semibold">{card.change}</span>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Chart visualization would go here</span>
                  </div>
                </div>
              )
            })}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">{card.title}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{card.value}</div>
                <div className="text-sm text-green-600 mt-1">{card.change} from last month</div>
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
              <div className="text-green-600 font-semibold">Revenue Chart</div>
              <div className="text-sm text-gray-500 mt-1">Interactive chart would be displayed here</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {['Blue Dream', 'OG Kush', 'Sativa Mix', 'CBD Gummies'].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
                  <span className="font-medium text-gray-900">{product}</span>
                </div>
                <div className="text-sm text-gray-500">${(Math.random() * 1000 + 500).toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
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
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'en-route' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
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
                                <div className="text-sm">Name: {order.customer}</div>
                                <div className="text-sm text-gray-600">Phone: (555) 123-4567</div>
                                <div className="text-sm text-gray-600">Email: customer@email.com</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Order Details</h4>
                              <div className="mt-2 space-y-1">
                                <div className="text-sm">Items: {order.items}</div>
                                <div className="text-sm">Amount: {order.amount}</div>
                                <div className="text-sm">Status: {order.status}</div>
                                <div className="text-sm text-gray-600">Ordered: {order.time}</div>
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
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Management</h2>
            <p className="text-gray-600">Manage all your cannabis orders and deliveries here.</p>
          </div>
        );
      case 'products':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Catalog</h2>
            <p className="text-gray-600">Manage your cannabis products, strains, and inventory.</p>
          </div>
        );
      case 'storefront':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Storefront Settings</h2>
            <p className="text-gray-600">Customize your public cannabis storefront and QR codes.</p>
          </div>
        );
      case 'drivers':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Management</h2>
            <p className="text-gray-600">Manage your delivery drivers and assignments.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payments & Billing</h2>
            <p className="text-gray-600">View payments, Stripe integration, and financial reports.</p>
          </div>
        );
      case 'customers':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Database</h2>
            <p className="text-gray-600">Manage customer information and loyalty programs.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reports</h2>
            <p className="text-gray-600">View detailed analytics and business insights.</p>
          </div>
        );
      case 'support':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Support Center</h2>
            <p className="text-gray-600">Handle customer support and tickets.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <p className="text-gray-600">Manage your account, preferences, and team settings.</p>
          </div>
        );
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

// Login Page Component
const LoginPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate login success and redirect to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="page-container">
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1648824572347-6edd9a108e28')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-black/90"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-leaf floating-leaf-1"></div>
          <div className="floating-leaf floating-leaf-2"></div>
          <div className="floating-leaf floating-leaf-3"></div>
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-12">
        <div className="container mx-auto px-8">
          <div className="max-w-md mx-auto">
            <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="glass-card p-8 rounded-xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="font-unbounded text-3xl font-light text-white mb-2">
                    Welcome Back
                  </h1>
                  <p className="font-manrope text-white/70 text-sm">
                    Sign in to your dispensary dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-manrope text-white/80 text-sm mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-green-400'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-400 text-sm font-manrope">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-manrope text-white/80 text-sm mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                        errors.password ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-green-400'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="mt-1 text-red-400 text-sm font-manrope">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        checked={formData.remember}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-green-400 focus:ring-green-400 focus:ring-2"
                      />
                      <label htmlFor="remember" className="ml-2 font-manrope text-white/80 text-sm">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="font-manrope text-green-400 hover:text-green-300 text-sm transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-400 text-black px-6 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
                  >
                    Sign In →
                  </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-white/20">
                  <p className="font-manrope text-white/70 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
function App() {
  return (
    <div className="kush-door-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <Navigation />
              <HomePage />
              <AccessModal />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardMain />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;