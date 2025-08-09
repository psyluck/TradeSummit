import React from 'react';
import { Workflow, Zap, GitBranch, Clock, Shield, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Workflow,
    title: 'Visual Workflow Builder',
    description: 'Drag-and-drop interface to create complex automation workflows without writing code.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Real-time Triggers',
    description: 'Instant responses to events across your systems with sub-second latency.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: GitBranch,
    title: 'Conditional Logic',
    description: 'Smart decision trees that adapt based on data, user behavior, and business rules.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Clock,
    title: 'Scheduled Automation',
    description: 'Time-based triggers for recurring tasks, reports, and maintenance operations.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Error Handling',
    description: 'Robust error recovery with automatic retries, fallbacks, and alert notifications.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Detailed insights into automation performance, success rates, and optimization opportunities.',
    color: 'from-indigo-500 to-purple-500'
  }
];

const AutomationFeatures = () => {
  return (
    <section id="automation" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Automation
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Engine
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build sophisticated automation workflows that connect your AI agents with any system, API, or database.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/50 rounded-2xl transition-all duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Workflow Example */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              See Automation in Action
            </h3>
            <p className="text-lg text-gray-600">
              Example: Customer onboarding workflow with multiple touchpoints
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">New User Signs Up</h4>
              <p className="text-sm text-gray-600">Trigger activated when user completes registration</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Welcome Email</h4>
              <p className="text-sm text-gray-600">Personalized welcome message sent automatically</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Account Setup</h4>
              <p className="text-sm text-gray-600">AI agent guides user through initial configuration</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Follow-up</h4>
              <p className="text-sm text-gray-600">Scheduled check-ins and support offers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationFeatures;