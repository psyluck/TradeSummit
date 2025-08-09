import React from 'react';
import { Bot, MessageSquare, Database, Calendar, Mail, FileText, BarChart3, Shield } from 'lucide-react';

const agents = [
  {
    icon: MessageSquare,
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries, resolves issues, and escalates complex problems to human agents.',
    capabilities: ['24/7 availability', 'Multi-language support', 'Sentiment analysis', 'Ticket routing'],
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  {
    icon: BarChart3,
    name: 'Sales Intelligence Agent',
    description: 'Qualifies leads, schedules meetings, and provides personalized product recommendations.',
    capabilities: ['Lead scoring', 'CRM integration', 'Follow-up automation', 'Pipeline management'],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50'
  },
  {
    icon: Database,
    name: 'Data Processing Agent',
    description: 'Analyzes large datasets, generates reports, and identifies patterns and insights.',
    capabilities: ['Real-time processing', 'Custom reports', 'Anomaly detection', 'API integrations'],
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50'
  },
  {
    icon: Calendar,
    name: 'Scheduling Agent',
    description: 'Manages calendars, books appointments, and coordinates meetings across time zones.',
    capabilities: ['Smart scheduling', 'Conflict resolution', 'Reminder automation', 'Calendar sync'],
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50'
  },
  {
    icon: Mail,
    name: 'Email Marketing Agent',
    description: 'Creates personalized email campaigns, manages lists, and optimizes send times.',
    capabilities: ['A/B testing', 'Personalization', 'Deliverability optimization', 'Performance tracking'],
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'from-indigo-50 to-purple-50'
  },
  {
    icon: FileText,
    name: 'Content Creation Agent',
    description: 'Generates blog posts, social media content, and marketing materials at scale.',
    capabilities: ['SEO optimization', 'Brand voice consistency', 'Multi-format content', 'Plagiarism checking'],
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'from-teal-50 to-cyan-50'
  }
];

const AgentShowcase = () => {
  return (
    <section id="agents" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pre-Built AI Agents
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Ready to Deploy
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our library of specialized AI agents or customize them to fit your unique business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${agent.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <agent.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {agent.name}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {agent.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Key Capabilities:</h4>
                <ul className="space-y-2">
                  {agent.capabilities.map((capability, capIndex) => (
                    <li key={capIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3"></div>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Deploy Agent
              </button>

              {/* Subtle gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${agent.bgColor} opacity-0 group-hover:opacity-30 rounded-2xl transition-all duration-300 -z-10`}></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200">
            View All Agents
          </button>
        </div>
      </div>
    </section>
  );
};

export default AgentShowcase;