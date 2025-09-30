import { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  processPayment: (data: PaymentRequest) => Promise<PaymentResult>;
  isProcessing: boolean;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
  paymentMethod?: 'card' | 'paypal' | 'stripe';
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (data: PaymentRequest): Promise<PaymentResult> => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        return {
          success: true,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      } else {
        return {
          success: false,
          error: 'Payment declined by bank'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ processPayment, isProcessing }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};