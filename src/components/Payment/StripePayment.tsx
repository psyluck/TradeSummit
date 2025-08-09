import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

interface StripePaymentFormProps {
  plan: {
    name: string;
    price: string;
    setupFee: string;
  };
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ plan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            country: customerInfo.country,
            postal_code: customerInfo.zipCode,
          },
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // In a real implementation, you would send this to your backend
      // to create a payment intent and confirm the payment
      
      // Simulate successful payment
      setTimeout(() => {
        onSuccess({
          id: 'pi_' + Math.random().toString(36).substr(2, 9),
          status: 'succeeded',
          amount: parseInt(plan.price.replace(/[^0-9]/g, '')) * 100,
          currency: 'usd',
          payment_method: paymentMethod?.id
        });
        setIsProcessing(false);
      }, 2000);

    } catch (err) {
      onError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Billing Information
        </h3>
        
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Your Company Inc."
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            </select>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Payment Method
        </h3>
        
        <div className="border border-slate-300 rounded-lg p-4 mb-4">
          <CardElement options={cardElementOptions} />
        </div>
        
        <div className="flex items-center text-sm text-slate-600">
          <Lock className="w-4 h-4 mr-2" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-6">
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
          <div className="border-t border-slate-300 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Today</span>
              <span className="text-orange-600">{plan.setupFee}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Monthly billing starts after setup completion
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Complete Payment</span>
          </>
        )}
      </button>

      <div className="text-center text-sm text-slate-500">
        <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
        <p className="mt-1">Powered by Stripe • PCI DSS Compliant</p>
      </div>
    </form>
  );
};

interface StripePaymentProps {
  plan: {
    name: string;
    price: string;
    setupFee: string;
  };
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ plan, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm plan={plan} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripePayment;