import React from 'react';
import { Shield, Lock, Eye, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const complianceFeatures = [
  {
    icon: Shield,
    name: 'HIPAA Compliance',
    description: 'Healthcare data protection with encrypted storage, access controls, and audit trails.',
    features: ['Data Encryption', 'Access Controls', 'Audit Logging', 'BAA Available'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Lock,
    name: 'SOC 2 Ready',
    description: 'Security controls and monitoring aligned with SOC 2 Type II requirements.',
    features: ['Security Controls', 'Monitoring', 'Incident Response', 'Regular Audits'],
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: FileCheck,
    name: 'GDPR Compliant',
    description: 'European privacy compliance with data minimization and user rights management.',
    features: ['Data Minimization', 'User Rights', 'Consent Management', 'Data Portability'],
    color: 'from-purple-500 to-pink-500'
  }
];

const safetyFeatures = [
  {
    icon: AlertTriangle,
    title: 'Content Filtering',
    description: 'AI content filtering to prevent inappropriate or harmful responses.',
    color: 'text-red-500'
  },
  {
    icon: Shield,
    title: 'Response Monitoring',
    description: 'Real-time monitoring of AI responses for quality and compliance.',
    color: 'text-blue-500'
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Automatic detection and protection of sensitive information.',
    color: 'text-purple-500'
  },
  {
    icon: CheckCircle,
    title: 'Human Oversight',
    description: 'Easy escalation to human agents when needed.',
    color: 'text-emerald-500'
  }
];

const ComplianceSection = () => {
  return (
    <section id="compliance" className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Built for
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              {' '}Compliance
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Enterprise-grade security and compliance features that meet industry standards 
            while keeping your AI agents safe and reliable.
          </p>
        </div>

        {/* Compliance Standards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {complianceFeatures.map((standard, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 shadow-lg border border-orange-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${standard.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <standard.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {standard.name}
              </h3>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {standard.description}
              </p>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Features</h4>
                <div className="space-y-2">
                  {standard.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Safety Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-orange-200">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              AI Safety
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {' '}Features
              </span>
            </h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Built-in safety mechanisms ensure your AI agents operate responsibly and within appropriate boundaries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 border border-orange-200">
              <h4 className="text-xl font-bold text-slate-900 mb-4">Enterprise Security</h4>
              <p className="text-slate-600 mb-6">
                End-to-end encryption, secure data handling, and comprehensive audit trails for enterprise peace of mind.
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Learn More About Security
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;