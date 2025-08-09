import React from 'react';
import { 
  ArrowRight,
  CheckCircle,
  Link,
  Zap,
  Settings
} from 'lucide-react';

const popularIntegrations = [
  { 
    name: 'Salesforce', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    category: 'CRM',
    description: 'Customer relationship management'
  },
  { 
    name: 'HubSpot', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg',
    category: 'CRM',
    description: 'Marketing & sales platform'
  },
  { 
    name: 'Slack', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    category: 'Communication',
    description: 'Team messaging platform'
  },
  { 
    name: 'Shopify', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
    category: 'E-commerce',
    description: 'Online store platform'
  },
  { 
    name: 'Zendesk', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg',
    category: 'Support',
    description: 'Customer support platform'
  },
  { 
    name: 'Microsoft Teams', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg',
    category: 'Communication',
    description: 'Business communication'
  },
  { 
    name: 'Zapier', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Zapier_logo.svg',
    category: 'Automation',
    description: 'Workflow automation'
  },
  { 
    name: 'SAP', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
    category: 'ERP',
    description: 'Enterprise resource planning'
  }
];

const IntegrationsHub = () => {
  return (
    <section id="integrations" className="py-24 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Popular
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              {' '}Integrations
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Connect your AI agents with the tools you already use. 
            Set up integrations in minutes with our pre-built connectors.
          </p>
        </div>

        {/* Popular Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {popularIntegrations.map((integration, index) => (
            <div
              key={index}
              className="bg-white border border-orange-200 rounded-2xl p-8 text-center hover:shadow-lg hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-50 rounded-xl group-hover:scale-110 transition-transform overflow-hidden">
                <img
                  src={integration.logo}
                  alt={`${integration.name} logo`}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target;
                    target.style.display = 'none';
                    const fallback = target.parentElement.querySelector('.fallback-logo');
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="fallback-logo hidden w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg items-center justify-center text-2xl font-bold text-white">
                  {integration.name.charAt(0)}
                </div>
              </div>
              <h4 className="font-bold text-slate-900 mb-2 text-lg">
                {integration.name}
              </h4>
              <p className="text-sm text-orange-600 font-medium mb-2">
                {integration.category}
              </p>
              <p className="text-xs text-slate-600 mb-4">
                {integration.description}
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Custom Integration Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-orange-200 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Need a Custom
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                {' '}Integration?
              </span>
            </h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Don't see your tool? We support REST APIs and webhooks, 
              plus we can build custom integrations for enterprise customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Link className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">REST API</h4>
              <p className="text-slate-600 text-sm">Connect to any REST API with authentication and error handling.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Webhooks</h4>
              <p className="text-slate-600 text-sm">Real-time data sync with webhook support for instant updates.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Custom Build</h4>
              <p className="text-slate-600 text-sm">We'll build custom integrations for your specific requirements.</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <span>View All Integrations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border-2 border-orange-300 text-slate-700 px-8 py-3 rounded-xl font-semibold hover:border-orange-500 hover:text-orange-600 transition-all duration-200">
                Request Integration
              </button>
            </div>
          </div>
        </div>

        {/* Integration Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">50+</div>
            <div className="text-slate-600">Available Integrations</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">99.9%</div>
            <div className="text-slate-600">Integration Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">5min</div>
            <div className="text-slate-600">Average Setup Time</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
            <div className="text-slate-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsHub;