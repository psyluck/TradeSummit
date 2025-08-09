import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  selectedPlan: string | null;
  setSelectedPlan: (plan: string) => void;
  paymentMethod: 'stripe' | 'payoneer' | null;
  setPaymentMethod: (method: 'stripe' | 'payoneer') => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'payoneer' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <PaymentContext.Provider
      value={{
        selectedPlan,
        setSelectedPlan,
        paymentMethod,
        setPaymentMethod,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};