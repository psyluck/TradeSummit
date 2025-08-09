import React from 'react';
import { 
  Heart, 
  DollarSign, 
  ShoppingBag, 
  Home, 
  Phone, 
  Users,
  Shield,
  CheckCircle
} from 'lucide-react';

const industries = [
  {
    icon: Heart,
    name: 'Healthcare',
    description: 'HIPAA-compliant AI agents for patient support, appointment scheduling, and basic medical inquiries.',
    features: ['Patient Scheduling', 'Basic Health Q&A', 'Insurance Verification', 'Follow-up Reminders'],
    integrations: ['Epic MyChart', 'Cerner', 'Practice Management Systems'],
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    icon: DollarSign,
    name: 'Financial Services',
    description: 'Secure AI agents for account inquiries, transaction support, and basic financial guidance.',
    features: ['Account Balance', 'Transaction History', 'Payment Processing', 'Basic Financial Tips'],
    integrations: ['Banking APIs', 'Payment Processors', 'CRM Systems'],
    color: 'from-emerald-500 to-green-500',
    bgColor: 'from-emerald-50 to-green-50',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    icon: ShoppingBag,
    name: 'E-commerce',
    description: 'Customer support agents for order tracking, product questions, and return processing.',
    features: ['Order Tracking', 'Product Support', 'Return Processing', 'Inventory Checks'],
    integrations: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce'],
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
    image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    icon: Home,
    name: 'Real Estate',
    description: 'Lead qualification agents for property inquiries, scheduling viewings, and market information.',
    features: ['Lead Qualification', 'Property Info', 'Viewing Scheduling', 'Market Updates'],
    integrations: ['MLS Systems', 'CRM Platforms', 'Scheduling Tools'],
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    image: 'https://images.pexels.com/photos/7578927/pexels-photo-7578927.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    icon: Phone,
    name: 'SaaS & Tech',
    description: 'Technical support agents for troubleshooting, onboarding, and feature explanations.',
    features: ['Technical Support', 'User Onboarding', 'Feature Guidance', 'Bug Reporting'],
    integrations: ['Help Desk Systems', 'Knowledge Bases', 'Ticketing Tools'],
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-50 to-purple-50',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    icon: Users,
    name: 'Professional Services',
    description: 'Client communication agents for appointment booking, project updates, and general inquiries.',
    features: ['Appointment Booking', 'Project Updates', 'Client Communication', 'Service Information'],
    integrations: ['Calendar Systems', 'Project Management', 'CRM Tools'],
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'from-teal-50 to-cyan-50',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  }
];

const IndustryShowcase = () => {
  return (
    <section id="industries" className="py-24 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Built for Your
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              {' '}Industry
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Pre-configured AI agents designed for specific industries with built-in compliance and integrations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-lg border border-orange-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden"
            >
              {/* Industry Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={industry.image}
                  alt={`${industry.name} industry`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${industry.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {industry.name}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                  {industry.description}
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {industry.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Popular Integrations</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.integrations.map((integration, intIndex) => (
                        <span key={intIndex} className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 mt-auto">
                  Try {industry.name} Agent
                </button>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${industry.bgColor} opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-500 -z-10`}></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Need Something Custom?</h3>
            <p className="text-slate-600 mb-6">
              We can customize AI agents for your specific industry requirements and workflows.
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;