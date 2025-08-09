import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Crown, ArrowRight } from 'lucide-react';
import PaymentModal from './Payment/PaymentModal';

const plans = [
  {
    name: 'Starter',
    price: '$1,200',
    period: '/month',
    setupFee: '$3,000',
    description: 'Perfect for small to medium businesses getting started',
    features: [
      '3 AI agents',
      '5,000 conversations/month',
      'Basic integrations (10)',
      'Email support',
      'Standard analytics',
      'Basic compliance features'
    ],
    limitations: [
      'Up to 5 team members',
      'Standard response times'
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonStyle: 'border-2 border-slate-300 text-slate-700 hover:border-orange-600 hover:text-orange-600',
    icon: Zap
  },
  {
    name: 'Professional',
    price: '$2,500',
    period: '/month',
    setupFee: '$5,000',
    description: 'For growing businesses with advanced needs',
    features: [
      '10 AI agents',
      '25,000 conversations/month',
      'All integrations (50+)',
      'Priority support',
      'Advanced analytics',
      'Custom workflows',
      'Team collaboration',
      'HIPAA compliance',
      'API access',
      'Custom branding'
    ],
    limitations: [
      'Up to 25 team members'
    ],
    popular: true,
    buttonText: 'Start Trial',
    buttonStyle: 'bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:shadow-xl transform hover:scale-105',
    icon: Star
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    setupFee: 'From $10,000',
    description: 'For large organizations with mission-critical requirements',
    features: [
      'Unlimited AI agents',
      'Unlimited conversations',
      'Custom integrations',
      'Dedicated success manager',
      'Enterprise SLA (99.99%)',
      'Advanced security features',
      'On-premise deployment',
      'White-label options',
      'Custom AI training',
      'Professional services',
      'Multi-region deployment'
    ],
    limitations: [],
    popular: false,
    buttonText: 'Contact Sales',
    buttonStyle: 'border-2 border-slate-300 text-slate-700 hover:border-orange-600 hover:text-orange-600',
    icon: Crown
  }
];

const addOns = [
  {
    name: 'Additional Conversations',
    price: '$0.10',
    unit: 'per conversation',
    description: 'Scale beyond your plan limits'
  },
  {
    name: 'Premium Support',
    price: '$1,500',
    unit: 'per month',
    description: '24/7 phone support with 1-hour response SLA'
  },
  {
    name: 'Custom AI Training',
    price: '$15,000',
    unit: 'one-time',
    description: 'Train AI models on your specific data and use cases'
  },
  {
    name: 'Professional Services',
    price: '$3,000',
    unit: 'per day',
    description: 'Expert implementation and optimization services'
  }
];

const Pricing = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handlePlanSelect = (plan: any) => {
    if (plan.name === 'Enterprise') {
      // Handle enterprise contact
      window.open('mailto:sales@tradesummit.ai?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Enterprise
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              {' '}Pricing
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto">
            Professional AI agent solutions with transparent pricing. All plans include setup, training, and ongoing support.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? 'border-orange-500 transform scale-105 ring-4 ring-orange-100'
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-orange-500 to-blue-600' 
                      : 'bg-slate-100'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                </div>
                
                <p className="text-slate-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 text-lg ml-1">{plan.period}</span>}
                  </div>
                  <div className="text-sm text-slate-500">
                    Setup fee: <span className="font-semibold">{plan.setupFee}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 mb-8 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-semibold text-slate-900 mb-3">Plan limits:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-center space-x-3">
                            <div className="w-5 h-5 border border-slate-300 rounded flex-shrink-0"></div>
                            <span className="text-slate-600 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Add-ons &
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                {' '}Services
              </span>
            </h3>
            <p className="text-lg text-slate-600">
              Extend your platform capabilities with additional services and support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
              >
                <h4 className="font-bold text-slate-900 mb-2">{addon.name}</h4>
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {addon.price}
                  <span className="text-sm text-slate-600 font-normal"> {addon.unit}</span>
                </div>
                <p className="text-slate-600 text-sm">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-orange-100 mb-8">
                Join growing businesses using TradeSummit AI agents to automate customer support, 
                increase sales, and improve operational efficiency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={() => handlePlanSelect(plans[1])} // Professional plan
                  className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Start Free Trial</span>
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-2">
                  <span>Contact Sales</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          selectedPlan={selectedPlan}
        />
      )}
    </section>
  );
};

export default Pricing;