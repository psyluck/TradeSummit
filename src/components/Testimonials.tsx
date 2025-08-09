import React from 'react';
import { Star, Quote, Building2, Users, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Customer Success Manager',
    company: 'TechFlow Solutions',
    industry: 'SaaS',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    content: 'Basebyte Infinity transformed our customer support. We went from 12-hour response times to instant replies, and our customer satisfaction scores increased by 35%. The setup was surprisingly easy.',
    rating: 5,
    metrics: {
      improvement: '35% Higher Satisfaction',
      automation: '80% Queries Automated',
      time: '12hrs → Instant Response'
    }
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    company: 'HealthCare Plus',
    industry: 'Healthcare',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    content: 'The HIPAA compliance features gave us confidence to deploy AI for patient inquiries. Our staff can now focus on complex cases while the AI handles appointment scheduling and basic questions.',
    rating: 5,
    metrics: {
      improvement: '60% Staff Time Saved',
      automation: '24/7 Patient Support',
      compliance: 'HIPAA Certified'
    }
  },
  {
    name: 'Emily Rodriguez',
    role: 'E-commerce Manager',
    company: 'StyleHub Retail',
    industry: 'Retail',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    content: 'Our Shopify integration was seamless. The AI agent handles order tracking, returns, and product questions perfectly. We\'ve seen a 25% increase in customer satisfaction and reduced support tickets by half.',
    rating: 5,
    metrics: {
      improvement: '25% Higher Satisfaction',
      automation: '50% Fewer Tickets',
      integration: 'Shopify Connected'
    }
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Loved by
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Businesses
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how companies are using AI agents to improve customer experience and reduce support workload.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 hover:-translate-y-1"
            >
              <Quote className="w-10 h-10 text-indigo-500 mb-6 opacity-60" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-1 gap-3 mb-8 p-4 bg-slate-50 rounded-2xl">
                <div className="text-center">
                  <div className="text-sm font-bold text-indigo-600">{testimonial.metrics.improvement}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-emerald-600">{testimonial.metrics.automation}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{testimonial.metrics.time || testimonial.metrics.compliance || testimonial.metrics.integration}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-slate-600 text-sm">{testimonial.role}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-indigo-600 text-sm font-semibold">{testimonial.company}</p>
                    <span className="text-slate-400">•</span>
                    <p className="text-slate-500 text-xs">{testimonial.industry}</p>
                  </div>
                </div>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/30 group-hover:to-purple-50/30 rounded-3xl transition-all duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-8">Join Growing Businesses</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group hover:scale-105 transition-transform">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-cyan-300 mr-2" />
                <div className="text-4xl font-bold">500+</div>
              </div>
              <div className="text-indigo-200">Active Businesses</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-300 mr-2" />
                <div className="text-4xl font-bold">99.9%</div>
              </div>
              <div className="text-indigo-200">Uptime</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-yellow-300 mr-2" />
                <div className="text-4xl font-bold">1M+</div>
              </div>
              <div className="text-indigo-200">Conversations</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-pink-300 mr-2" />
                <div className="text-4xl font-bold">4.9/5</div>
              </div>
              <div className="text-indigo-200">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;