import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Globe,
  Shield
} from 'lucide-react';

interface PayoneerPaymentProps {
  plan: {
    name: string;
    price: string;
    setupFee: string;
  };
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

const PayoneerPayment: React.FC<PayoneerPaymentProps> = ({ plan, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Payoneer payment processing
      // In a real implementation, you would integrate with Payoneer's API
      
      setTimeout(() => {
        onSuccess({
          id: 'pyo_' + Math.random().toString(36).substr(2, 9),
          status: 'completed',
          amount: parseInt(plan.price.replace(/[^0-9]/g, '')) * 100,
          currency: 'usd',
          payment_method: paymentMethod,
          provider: 'payoneer'
        });
        setIsProcessing(false);
      }, 3000);

    } catch (err) {
      onError('Payoneer payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payoneer Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Payoneer Payment</h3>
            <p className="text-blue-100">Global payment solution with local expertise</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">200+</div>
            <div className="text-sm text-blue-100">Countries</div>
          </div>
          <div>
            <div className="text-2xl font-bold">150+</div>
            <div className="text-sm text-blue-100">Currencies</div>
          </div>
          <div>
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm text-blue-100">Uptime</div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              paymentMethod === 'card'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <div className="font-medium">Credit Card</div>
            <div className="text-xs text-slate-500">Visa, Mastercard</div>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentMethod('bank')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              paymentMethod === 'bank'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-6 h-6 mx-auto mb-2 bg-slate-400 rounded"></div>
            <div className="font-medium">Bank Transfer</div>
            <div className="text-xs text-slate-500">ACH, Wire</div>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentMethod('wallet')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              paymentMethod === 'wallet'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="w-6 h-6 mx-auto mb-2 bg-purple-400 rounded"></div>
            <div className="font-medium">Digital Wallet</div>
            <div className="text-xs text-slate-500">PayPal, Apple Pay</div>
          </button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={customerInfo.company}
              onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Company Inc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Business Street"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={customerInfo.city}
              onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New York"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Country *
            </label>
            <select
              required
              value={customerInfo.country}
              onChange={(e) => setCustomerInfo({...customerInfo, country: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="SG">Singapore</option>
              <option value="IN">India</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">{plan.name} Plan</span>
            <span className="font-semibold">{plan.price}/month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Setup Fee</span>
            <span className="font-semibold">{plan.setupFee}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Payoneer Processing Fee</span>
            <span>Included</span>
          </div>
          <div className="border-t border-slate-300 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Today</span>
              <span className="text-blue-600">{plan.setupFee}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Monthly billing starts after setup completion
            </p>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          Security & Compliance
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>PCI DSS Level 1 Certified</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Anti-Fraud Protection</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Global Compliance</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing with Payoneer...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Pay with Payoneer</span>
          </>
        )}
      </button>

      <div className="text-center text-sm text-slate-500">
        <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
        <p className="mt-1">Powered by Payoneer • Globally Compliant</p>
      </div>
    </form>
  );
};

export default PayoneerPayment;