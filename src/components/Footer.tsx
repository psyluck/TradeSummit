import React from 'react';
import { Twitter, Linkedin, Github, Mail, Shield, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/TradeSummit.png" 
                alt="TradeSummit" 
                className="h-12 w-auto brightness-0 invert"
              />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Trade
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Summit
                </span>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              AI agents that actually work for your business. Deploy intelligent customer support, 
              sales assistance, and automation with enterprise-grade security.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-lg mb-6">Product</h3>
            <ul className="space-y-4 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">AI Agents</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-bold text-lg mb-6">Solutions</h3>
            <ul className="space-y-4 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sales Automation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Healthcare</a></li>
              <li><a href="#" className="hover:text-white transition-colors">E-commerce</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Real Estate</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SaaS</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-slate-800 mt-16 pt-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-orange-400" />
                Get in Touch
              </h4>
              <p className="text-slate-300 mb-2">Sales: hello@tradesummit.ai</p>
              <p className="text-slate-300 mb-2">Support: support@tradesummit.ai</p>
              <p className="text-slate-300">Phone: +1 (555) 123-4567</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                Security & Compliance
              </h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>SOC 2 Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span>GDPR Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © 2025 TradeSummit. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;