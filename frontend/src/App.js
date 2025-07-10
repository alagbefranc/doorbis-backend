import React, { useEffect, useState } from "react";
import "./App.css";

const KushDoorLanding = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger loading animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Prevent initial scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const handleGetAccess = () => {
    // Enable scrolling and show more content
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Smooth scroll to next section or show modal
    const modal = document.getElementById('access-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  };

  return (
    <div className="kush-door-app">
      {/* Background Video Layer */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586275019508-fc4863eb2fd2')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-900/60 to-black/90"></div>
        
        {/* Floating Cannabis Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-leaf floating-leaf-1"></div>
          <div className="floating-leaf floating-leaf-2"></div>
          <div className="floating-leaf floating-leaf-3"></div>
        </div>
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 text-green-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
            </svg>
          </div>
          <span className="font-unbounded text-white text-lg font-light">DoorBis</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 font-manrope text-white/80 text-sm">
          <a href="#features" className="hover:text-green-400 transition-colors">Features</a>
          <a href="#dispensaries" className="hover:text-green-400 transition-colors">For Dispensaries</a>
          <a href="#drivers" className="hover:text-green-400 transition-colors">For Drivers</a>
          <a href="#pricing" className="hover:text-green-400 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a>
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

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-8 pt-32">
          <div className="max-w-2xl">
            {/* Hero Text */}
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
            
            {/* Features Preview */}
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

      {/* Decorative Elements */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 origin-right z-10">
        <div className="text-white/40 text-sm tracking-widest rotate-90 font-manrope">
          DISPENSARY FREEDOM / CHAPTER ONE
        </div>
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-4 left-6 text-xs text-white/50 font-manrope z-10">
        ✦ Built for Local Highs, 2025
      </footer>
      
      <div className="fixed bottom-4 right-6 text-xs text-white/50 font-manrope z-10">
        © DoorBis, 2025
      </div>

      {/* Access Modal */}
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
    </div>
  );
};

function App() {
  return <KushDoorLanding />;
}

export default App;