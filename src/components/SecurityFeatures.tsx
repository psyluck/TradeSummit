import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Key, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Fingerprint,
  Globe,
  Database,
  Zap,
  FileCheck
} from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Zero-Trust Architecture',
    description: 'Every request is verified, authenticated, and authorized before processing.',
    features: ['Identity Verification', 'Continuous Authentication', 'Least Privilege Access', 'Network Segmentation'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption for data at rest and in transit with perfect forward secrecy.',
    features: ['AES-256 Encryption', 'TLS 1.3', 'Key Rotation', 'Hardware Security Modules'],
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Fingerprint,
    title: 'Multi-Factor Authentication',
    description: 'Advanced MFA with biometrics, hardware tokens, and adaptive authentication.',
    features: ['Biometric Authentication', 'Hardware Tokens', 'Adaptive MFA', 'Risk-Based Authentication'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Eye,
    title: 'Continuous Monitoring',
    description: '24/7 security monitoring with AI-powered threat detection and response.',
    features: ['Real-time Monitoring', 'Threat Detection', 'Automated Response', 'Security Analytics'],
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Database,
    title: 'Data Loss Prevention',
    description: 'Advanced DLP with content inspection, classification, and policy enforcement.',
    features: ['Content Inspection', 'Data Classification', 'Policy Enforcement', 'Incident Response'],
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'Hardened infrastructure with isolated environments and secure deployment.',
    features: ['Container Security', 'Network Isolation', 'Secure Boot', 'Vulnerability Scanning'],
    color: 'from-teal-500 to-cyan-500'
  }
];

const certifications = [
  { name: 'SOC 2 Type II', icon: '🛡️', status: 'Certified' },
  { name: 'ISO 27001', icon: '🌐', status: 'Certified' },
  { name: 'HIPAA', icon: '🏥', status: 'Compliant' },
  { name: 'PCI DSS', icon: '💳', status: 'Level 1' },
  { name: 'FedRAMP', icon: '🏛️', status: 'In Progress' },
  { name: 'GDPR', icon: '🇪🇺', status: 'Compliant' }
];

const SecurityFeatures = () => {
  return (
    <section id="security" className="py-24 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Military-Grade
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Security
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto">
            Enterprise security that meets the highest standards. Protect your most sensitive data 
            with defense-in-depth architecture and continuous threat monitoring.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-20">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                {feature.description}
              </p>

              <div className="space-y-3">
                {feature.features.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 rounded-3xl transition-all duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Security Architecture Diagram */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">
              Defense-in-Depth
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {' '}Architecture
              </span>
            </h3>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Multiple layers of security controls protect your data and AI agents at every level.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Perimeter</h4>
              <p className="text-sm text-slate-300">WAF, DDoS Protection, IP Filtering</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Network</h4>
              <p className="text-sm text-slate-300">VPC, Segmentation, Monitoring</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Identity</h4>
              <p className="text-sm text-slate-300">MFA, SSO, RBAC</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Application</h4>
              <p className="text-sm text-slate-300">Code Security, API Protection</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Data</h4>
              <p className="text-sm text-slate-300">Encryption, DLP, Backup</p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">
              Security
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {' '}Certifications
              </span>
            </h3>
            <p className="text-lg text-slate-300">
              Independently verified security and compliance standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors text-3xl">
                  {cert.icon}
                </div>
                <h4 className="font-bold text-sm mb-1">{cert.name}</h4>
                <p className="text-xs text-cyan-400">{cert.status}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-slate-800/50 to-indigo-800/50 rounded-2xl p-8 border border-white/10">
              <h4 className="text-xl font-bold mb-4">Security Operations Center</h4>
              <p className="text-slate-300 mb-6">
                24/7 monitoring by certified security professionals with average response time under 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  View Security Dashboard
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200">
                  Download Security Whitepaper
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatures;