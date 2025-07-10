import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

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
        <button className="border border-white/40 text-white/80 px-4 py-1 rounded-full hover:bg-white/10 transition-colors font-manrope text-sm">
          Login
        </button>
      </div>
    </nav>
  );
};

// Home Page Component
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
                <button 
                  onClick={handleGetAccess}
                  className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25"
                >
                  Get Early Access →
                </button>
                <button className="border border-white/40 text-white px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors">
                  Book Demo
                </button>
              </div>
            </div>
            
            <div className={`mt-16 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-xl">
                  <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-unbounded text-white text-lg font-light mb-2">QR-Powered</h3>
                  <p className="font-manrope text-white/70 text-sm">Instant digital storefronts accessible via QR codes</p>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-unbounded text-white text-lg font-light mb-2">Local Drivers</h3>
                  <p className="font-manrope text-white/70 text-sm">Hire and manage local delivery drivers seamlessly</p>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-unbounded text-white text-lg font-light mb-2">Zero Downloads</h3>
                  <p className="font-manrope text-white/70 text-sm">No app installation required for customers</p>
                </div>
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

// Features Page Component
const FeaturesPage = () => {
  const features = [
    {
      title: "QR-Powered Storefronts",
      description: "Instant digital storefronts accessible via QR codes. No app downloads, no friction.",
      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
      image: "https://images.unsplash.com/photo-1622704776938-bed6cd156e04"
    },
    {
      title: "Real-Time Inventory",
      description: "Sync your inventory across all channels. Track stock levels and get alerts automatically.",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M6 7h12",
      image: "https://images.unsplash.com/photo-1648824572347-6edd9a108e28"
    },
    {
      title: "Driver Dispatch System",
      description: "Automated driver assignment and route optimization for efficient deliveries.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      image: "https://images.unsplash.com/photo-1551825687-f9de1603ed8b"
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive insights into sales, customer behavior, and delivery performance.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
      title: "Compliance Management",
      description: "Built-in compliance tools to ensure you meet all local and state regulations.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      image: "https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg"
    },
    {
      title: "Customer Communication",
      description: "Automated SMS and email notifications for order updates and delivery tracking.",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      image: "https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg"
    }
  ];

  return (
    <div className="page-container">
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-black/90"></div>
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="font-unbounded text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-white mb-6">
              Features Built for
              <span className="block text-green-400">Cannabis Commerce</span>
            </h1>
            <p className="font-manrope text-lg text-white/80 max-w-2xl mx-auto">
              Everything you need to digitize your dispensary and scale your delivery operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-8 rounded-xl group hover:scale-105 transition-all duration-300">
                <div 
                  className="w-full h-48 bg-cover bg-center rounded-lg mb-6"
                  style={{ backgroundImage: `url('${feature.image}')` }}
                />
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-unbounded text-white text-xl font-light mb-4">{feature.title}</h3>
                <p className="font-manrope text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25">
              Start Free Trial →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// For Dispensaries Page Component
const DispensariesPage = () => {
  const benefits = [
    {
      title: "Increase Revenue by 40%",
      description: "Average dispensaries see 40% revenue increase within 3 months of launch.",
      stat: "40%",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    },
    {
      title: "Reduce Operational Costs",
      description: "Streamline operations with automated inventory and delivery management.",
      stat: "30%",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    },
    {
      title: "Expand Customer Base",
      description: "Reach new customers through digital discovery and seamless ordering.",
      stat: "2x",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    }
  ];

  return (
    <div className="page-container">
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1622704776938-bed6cd156e04')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-black/90"></div>
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="font-unbounded text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-white mb-6">
              Transform Your
              <span className="block text-green-400">Dispensary Business</span>
            </h1>
            <p className="font-manrope text-lg text-white/80 max-w-2xl mx-auto">
              Join 500+ dispensaries using DoorBis to scale their operations and increase revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-card p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <div className="text-4xl font-unbounded text-green-400 font-light mb-2">{benefit.stat}</div>
                <h3 className="font-unbounded text-white text-xl font-light mb-4">{benefit.title}</h3>
                <p className="font-manrope text-white/70 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-12 rounded-xl mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-unbounded text-3xl font-light text-white mb-6">
                  Complete Cannabis Commerce Platform
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">QR-powered digital storefronts</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Automated inventory management</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Driver dispatch and delivery tracking</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Compliance and reporting tools</span>
                  </div>
                </div>
              </div>
              <div 
                className="w-full h-80 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1648824572347-6edd9a108e28')` }}
              />
            </div>
          </div>

          <div className="text-center">
            <button className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25 mr-4">
              Get Started →
            </button>
            <button className="border border-white/40 text-white px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// For Drivers Page Component
const DriversPage = () => {
  const driverBenefits = [
    {
      title: "Flexible Schedule",
      description: "Work when you want, where you want. Set your own hours and delivery radius.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      title: "Competitive Pay",
      description: "Earn $20-35/hour including tips. Weekly payouts directly to your account.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    },
    {
      title: "Smart Routing",
      description: "AI-powered route optimization to maximize your earnings and minimize drive time.",
      icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    },
    {
      title: "Real-Time Support",
      description: "24/7 driver support team ready to help with any delivery or technical issues.",
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
    }
  ];

  return (
    <div className="page-container">
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551825687-f9de1603ed8b')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-black/90"></div>
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="font-unbounded text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-white mb-6">
              Drive for
              <span className="block text-green-400">Cannabis Commerce</span>
            </h1>
            <p className="font-manrope text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join the fastest-growing network of cannabis delivery drivers. Earn more, work flexibly, and be part of the future of local commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25">
                Apply Now →
              </button>
              <button className="border border-white/40 text-white px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {driverBenefits.map((benefit, index) => (
              <div key={index} className="glass-card p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <h3 className="font-unbounded text-white text-lg font-light mb-3">{benefit.title}</h3>
                <p className="font-manrope text-white/70 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-12 rounded-xl mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div 
                className="w-full h-80 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url('https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg')` }}
              />
              <div>
                <h2 className="font-unbounded text-3xl font-light text-white mb-6">
                  Requirements & Getting Started
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Valid driver's license & insurance</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Background check (we'll handle this)</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Smartphone with GPS</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-manrope text-white/80">Must be 21+ years old</span>
                  </div>
                </div>
                <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-4">
                  <p className="font-manrope text-green-400 text-sm">
                    <strong>Quick Start:</strong> Complete application in 10 minutes, get approved within 24 hours, start earning same day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-unbounded text-2xl font-light text-white mb-4">Ready to Start Driving?</h2>
            <p className="font-manrope text-white/70 mb-8">Join thousands of drivers already earning with DoorBis</p>
            <button className="bg-green-400 text-black px-8 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25">
              Apply to Drive →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Pricing Page Component
const PricingPage = () => {
  const pricingTiers = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for new dispensaries getting started",
      features: [
        "QR-powered digital storefront",
        "Up to 100 products",
        "Basic analytics dashboard",
        "Email support",
        "5% transaction fee"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "$199",
      period: "/month",
      description: "Best for growing dispensaries",
      features: [
        "Everything in Starter",
        "Unlimited products",
        "Advanced analytics & reporting",
        "Driver dispatch system",
        "Priority support",
        "3% transaction fee",
        "Custom branding"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large operations and chains",
      features: [
        "Everything in Professional",
        "Multi-location management",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "1% transaction fee",
        "24/7 phone support"
      ],
      recommended: false
    }
  ];

  return (
    <div className="page-container">
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-black/90"></div>
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="font-unbounded text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-white mb-6">
              Simple, Transparent
              <span className="block text-green-400">Pricing</span>
            </h1>
            <p className="font-manrope text-lg text-white/80 max-w-2xl mx-auto">
              Choose the plan that fits your dispensary's needs. All plans include 30-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`glass-card p-8 rounded-xl relative ${tier.recommended ? 'border-2 border-green-400' : ''}`}>
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-unbounded text-2xl font-light text-white mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="font-unbounded text-4xl font-light text-green-400">{tier.price}</span>
                    <span className="font-manrope text-white/70">{tier.period}</span>
                  </div>
                  <p className="font-manrope text-white/70 text-sm">{tier.description}</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-manrope text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className={`w-full py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  tier.recommended 
                    ? 'bg-green-400 text-black hover:bg-green-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25' 
                    : 'border border-white/40 text-white hover:bg-white/10'
                }`}>
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 rounded-xl text-center">
            <h2 className="font-unbounded text-2xl font-light text-white mb-4">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="font-manrope text-white/80 text-sm">SSL Security</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-manrope text-white/80 text-sm">Compliance Tools</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="font-manrope text-white/80 text-sm">Auto Updates</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M12 12h.01M12 12h.01" />
                  </svg>
                </div>
                <span className="font-manrope text-white/80 text-sm">24/7 Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// FAQ Page Component
const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How does the QR-powered storefront work?",
      answer: "Customers scan a QR code at your dispensary or from your marketing materials to access your digital storefront. They can browse products, place orders, and pay - all without downloading an app. Your staff can manage inventory and orders in real-time through our dashboard."
    },
    {
      question: "What are the compliance requirements?",
      answer: "Our platform is built with cannabis compliance in mind. We support track-and-trace integration, age verification, local tax calculations, and reporting requirements. We stay updated with regulations in all legal cannabis markets."
    },
    {
      question: "How do I manage delivery drivers?",
      answer: "Our driver dispatch system automatically assigns orders to available drivers based on location and capacity. You can track deliveries in real-time, communicate with drivers, and manage payments all from your dashboard."
    },
    {
      question: "What payment methods do you support?",
      answer: "We support all major payment methods including credit cards, debit cards, digital wallets, and cash payments. All transactions are secure and compliant with banking regulations."
    },
    {
      question: "How long does setup take?",
      answer: "Most dispensaries are live within 24-48 hours. Our team handles the technical setup while you focus on uploading your products and customizing your storefront. We provide full onboarding support."
    },
    {
      question: "Can I integrate with my existing POS system?",
      answer: "Yes! We integrate with most major cannabis POS systems including Dutchie, Treez, Cova, and more. This ensures your inventory stays synchronized across all sales channels."
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "Our analytics dashboard provides insights into sales performance, customer behavior, delivery metrics, inventory turnover, and more. You can export reports for accounting and compliance purposes."
    },
    {
      question: "Is there a contract or can I cancel anytime?",
      answer: "All our plans are month-to-month with no long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time. We believe in earning your business every month."
    }
  ];

  return (
    <div className="page-container">
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1631112086050-4ca0b7ac73f3')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-900/70 to-black/90"></div>
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="font-unbounded text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-white mb-6">
              Frequently Asked
              <span className="block text-green-400">Questions</span>
            </h1>
            <p className="font-manrope text-lg text-white/80 max-w-2xl mx-auto">
              Get answers to common questions about our cannabis commerce platform.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card rounded-xl overflow-hidden">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <h3 className="font-unbounded text-white text-lg font-light pr-4">
                      {faq.question}
                    </h3>
                    <div className={`transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="font-manrope text-white/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="glass-card p-8 rounded-xl max-w-2xl mx-auto">
              <h2 className="font-unbounded text-2xl font-light text-white mb-4">
                Still Have Questions?
              </h2>
              <p className="font-manrope text-white/70 mb-6">
                Our team is here to help. Get in touch and we'll answer any questions you have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-400 text-black px-6 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-green-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25">
                  Contact Support
                </button>
                <button className="border border-white/40 text-white px-6 py-3 rounded-lg font-manrope text-sm font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
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
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/dispensaries" element={<DispensariesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
        <AccessModal />
      </BrowserRouter>
    </div>
  );
}

export default App;