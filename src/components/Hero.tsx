import React from 'react';
import { ArrowRight, Play, Shield, Zap, Users, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.1),transparent_50%)] bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Compliance Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">Enterprise Ready</span>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <span className="text-sm font-semibold text-slate-700">HIPAA Compliant</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              AI Agents That
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600 bg-clip-text text-transparent">
                Actually Work
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              Deploy intelligent AI agents for customer support, sales, and operations. 
              <span className="font-semibold text-slate-800"> Built for compliance</span> with seamless integrations 
              to your existing tools and workflows.
            </p>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center space-x-2 text-slate-600">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Deploy in Minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="font-medium">50+ Integrations</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button className="group bg-gradient-to-r from-orange-500 to-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg flex items-center space-x-3 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg">
                <span>Get Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group flex items-center space-x-3 text-slate-700 hover:text-orange-600 transition-colors">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all border border-orange-200">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                <span className="font-semibold">Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative lg:block">
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-orange-200 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="AI Customer Service Representative"
                  className="w-full h-96 object-cover"
                />
                
                {/* Overlay with AI Chat Interface */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">AI</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Aria - Customer Success Agent</div>
                          <div className="text-xs text-emerald-600 flex items-center">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                            Online & Ready to Help
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-700">
                        "Hello! I'm here to help you with any questions about TradeSummit. How can I assist you today?"
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-orange-200">
                <div className="text-2xl font-bold text-emerald-600">99.5%</div>
                <div className="text-sm text-slate-600">Customer Satisfaction</div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-orange-200">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-slate-600">Always Available</div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">10K+</div>
                <div className="text-sm text-slate-600">Conversations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="mt-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-200 p-8 md:p-12">
            <div className="text-center mb-8">
              <p className="text-slate-600 mb-6">Trusted by growing businesses</p>
              <div className="flex items-center justify-center space-x-8 opacity-60">
                <div className="text-2xl font-bold text-slate-700">TechCorp</div>
                <div className="text-2xl font-bold text-slate-700">MedFlow</div>
                <div className="text-2xl font-bold text-slate-700">RetailPro</div>
                <div className="text-2xl font-bold text-slate-700">FinanceHub</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">10,000+</div>
                <div className="text-slate-600">Conversations Handled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">99.5%</div>
                <div className="text-slate-600">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-slate-600">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;