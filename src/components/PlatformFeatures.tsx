import React from 'react';
import { 
  Workflow, 
  BarChart3, 
  Users, 
  Code, 
  MessageSquare,
  Zap,
  Brain,
  Settings
} from 'lucide-react';

const platformFeatures = [
  {
    icon: Brain,
    title: 'Smart AI Training',
    description: 'Train your AI agents on your specific data and use cases with our intuitive interface.',
    features: ['Custom Training Data', 'Industry Templates', 'Continuous Learning', 'Performance Optimization'],
    color: 'from-purple-500 to-pink-500',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  },
  {
    icon: Workflow,
    title: 'Visual Flow Builder',
    description: 'Create complex conversation flows with our drag-and-drop interface.',
    features: ['Drag & Drop Interface', 'Conditional Logic', 'Multi-step Workflows', 'Template Library'],
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance, user satisfaction, and identify areas for improvement.',
    features: ['Real-time Metrics', 'Conversation Analytics', 'Performance Reports', 'Custom Dashboards'],
    color: 'from-emerald-500 to-green-500',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with role-based access and team management features.',
    features: ['Role-based Access', 'Team Workspaces', 'Shared Templates', 'Activity Logs'],
    color: 'from-orange-500 to-red-500',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  },
  {
    icon: Code,
    title: 'Developer APIs',
    description: 'Integrate with your existing systems using our comprehensive REST APIs.',
    features: ['REST APIs', 'Webhook Support', 'SDK Libraries', 'API Documentation'],
    color: 'from-indigo-500 to-purple-500',
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  },
  {
    icon: MessageSquare,
    title: 'Multi-channel Support',
    description: 'Deploy your agents across web chat, messaging apps, and voice channels.',
    features: ['Web Chat Widget', 'Messaging Apps', 'Voice Integration', 'Email Support'],
    color: 'from-teal-500 to-cyan-500',
    image: 'https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  }
];

const PlatformFeatures = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Everything You Need
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              {' '}to Succeed
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            A complete platform for building, deploying, and managing AI agents 
            with enterprise-grade features and intuitive tools.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-20">
          {platformFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-lg border border-orange-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Feature Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 to-amber-50/0 group-hover:from-orange-50/30 group-hover:to-amber-50/30 rounded-3xl transition-all duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Quick Setup Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-orange-200 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Get Started in
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                {' '}Minutes
              </span>
            </h3>
            <p className="text-lg text-slate-600">
              Our setup wizard gets you up and running quickly with pre-built templates and guided configuration.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-orange-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Choose Template</h4>
              <p className="text-sm text-slate-600">Select from industry-specific templates</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-orange-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Configure Agent</h4>
              <p className="text-sm text-slate-600">Customize responses and behavior</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-orange-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Connect Tools</h4>
              <p className="text-sm text-slate-600">Integrate with your existing systems</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Go Live</h4>
              <p className="text-sm text-slate-600">Deploy and start helping customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;