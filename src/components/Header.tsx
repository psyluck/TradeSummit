import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-orange-200' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <img 
              src="/TradeSummit.png" 
              alt="TradeSummit" 
              className="h-16 w-auto"
            />
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Trade
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Summit
              </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#industries" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
              Industries
            </a>
            <a href="#compliance" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
              Compliance
            </a>
            <a href="#integrations" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
              Integrations
            </a>
            <a href="#pricing" className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
              Pricing
            </a>
            <div className="flex items-center space-x-4 ml-8">
              <button className="text-slate-700 hover:text-orange-600 transition-colors font-medium">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Get Demo</span>
              </button>
            </div>
          </nav>

          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-orange-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-orange-200 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <a href="#industries" className="block text-slate-700 hover:text-orange-600 transition-colors font-medium py-2">
                Industries
              </a>
              <a href="#compliance" className="block text-slate-700 hover:text-orange-600 transition-colors font-medium py-2">
                Compliance
              </a>
              <a href="#integrations" className="block text-slate-700 hover:text-orange-600 transition-colors font-medium py-2">
                Integrations
              </a>
              <a href="#pricing" className="block text-slate-700 hover:text-orange-600 transition-colors font-medium py-2">
                Pricing
              </a>
              <div className="pt-4 space-y-3">
                <button className="block w-full text-left text-slate-700 hover:text-orange-600 transition-colors font-medium py-2">
                  Sign In
                </button>
                <button className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Get Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;