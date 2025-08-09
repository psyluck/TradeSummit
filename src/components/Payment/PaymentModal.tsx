import React, { useState } from 'react';
import { X, CreditCard, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import StripePayment from './StripePayment';
import PayoneerPayment from './PayoneerPayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    setupFee: string;
    features: string[];
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'payoneer' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

  const handlePaymentSuccess = (paymentResult: any) => {
    setPaymentStatus('success');
    setPaymentMessage('Payment successful! Your account is being set up.');
    
    // Simulate account setup
    setTimeout(() => {
      onClose();
      // In a real app, redirect to dashboard or show success page
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    setPaymentMessage(error);
  };

  const resetPayment = () => {
    setSelectedProvider(null);
    setPaymentStatus('idle');
    setPaymentMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Complete Your Purchase</h2>
              <p className="text-slate-600">{selectedPlan.name} Plan</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {paymentStatus === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Payment Successful!</h3>
                  <p className="text-emerald-700">{paymentMessage}</p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="text-lg font-bold text-red-900">Payment Failed</h3>
                  <p className="text-red-700">{paymentMessage}</p>
                </div>
              </div>
              <button
                onClick={resetPayment}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!selectedProvider && paymentStatus === 'idle' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Your Payment Method</h3>
                <p className="text-slate-600">Select your preferred payment provider to continue</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Stripe Option */}
                <div
                  onClick={() => setSelectedProvider('stripe')}
                  className="border-2 border-slate-200 rounded-2xl p-6 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Stripe</h4>
                      <p className="text-sm text-slate-600">Global payment processing</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>Instant processing</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>All major credit cards</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>Bank-level security</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>PCI DSS compliant</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-3 rounded-xl font-semibold group-hover:shadow-lg transition-all">
                    Pay with Stripe
                  </button>
                </div>

                {/* Payoneer Option */}
                <div
                  onClick={() => setSelectedProvider('payoneer')}
                  className="border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Payoneer</h4>
                      <p className="text-sm text-slate-600">Global payment platform</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>200+ countries supported</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>Multiple payment methods</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>Local currency support</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      <span>Enterprise-grade security</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold group-hover:shadow-lg transition-all">
                    Pay with Payoneer
                  </button>
                </div>
              </div>

              {/* Plan Summary */}
              <div className="bg-slate-50 rounded-xl p-6 mt-8">
                <h4 className="font-bold text-slate-900 mb-4">Plan Summary</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">{selectedPlan.name} Plan</h5>
                    <div className="space-y-2">
                      {selectedPlan.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Monthly Price</span>
                        <span className="font-semibold">{selectedPlan.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Setup Fee</span>
                        <span className="font-semibold">{selectedPlan.setupFee}</span>
                      </div>
                      <div className="border-t border-slate-300 pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Due Today</span>
                          <span className="text-orange-600">{selectedPlan.setupFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedProvider === 'stripe' && paymentStatus === 'idle' && (
            <div>
              <button
                onClick={resetPayment}
                className="mb-6 text-orange-600 hover:text-orange-700 font-medium"
              >
                ← Back to payment methods
              </button>
              <StripePayment
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}

          {selectedProvider === 'payoneer' && paymentStatus === 'idle' && (
            <div>
              <button
                onClick={resetPayment}
                className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to payment methods
              </button>
              <PayoneerPayment
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;