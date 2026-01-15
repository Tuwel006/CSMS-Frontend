import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail?: string;
}

interface PaymentGatewayProps {
  paymentData: PaymentData;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const PaymentGateway = ({ paymentData, onSuccess, onError, onCancel }: PaymentGatewayProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Math.random() > 0.1) {
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        onSuccess(transactionId);
      } else {
        throw new Error('Payment declined by bank');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        'rounded-xs shadow-2xl max-w-md w-full overflow-hidden',
        isDark ? 'bg-gray-800' : 'bg-white'
      )}>
        {/* Header */}
        <div className={cn(
          'p-4 border-b',
          isDark 
            ? 'bg-gradient-to-r from-blue-600 to-green-600 border-gray-700' 
            : 'bg-gradient-to-r from-blue-600 to-green-600'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-xs">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Secure Payment</h2>
                <p className="text-xs text-blue-100">256-bit SSL encrypted</p>
              </div>
            </div>
            <button 
              onClick={onCancel} 
              className="text-white hover:bg-white/20 p-1 rounded-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className={cn(
          'p-4 border-b',
          isDark ? 'border-gray-700' : 'border-gray-200'
        )}>
          <div className="flex justify-between items-center mb-1">
            <span className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>Amount</span>
            <span className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>
              {paymentData.currency} {paymentData.amount.toFixed(2)}
            </span>
          </div>
          <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>{paymentData.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Card Number */}
          <div>
            <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Card Number
            </label>
            <div className="relative">
              <CreditCard className={cn('absolute left-2 top-2 w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-500')} />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={cn(
                  'w-full pl-8 pr-3 py-2 text-xs rounded-xs border transition-colors',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                )}
                required
              />
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                className={cn(
                  'w-full px-3 py-2 text-xs rounded-xs border transition-colors',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                )}
                required
              />
            </div>
            <div>
              <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                placeholder="123"
                maxLength={4}
                className={cn(
                  'w-full px-3 py-2 text-xs rounded-xs border transition-colors',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                )}
                required
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className={cn('block text-xs font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className={cn(
                'w-full px-3 py-2 text-xs rounded-xs border transition-colors',
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              )}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'flex-1 py-2 px-3 text-xs font-medium rounded-xs border transition-colors',
                isDark
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs font-medium rounded-xs hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Pay Now
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className={cn(
          'px-4 pb-4',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )}>
          <div className="flex items-center gap-1 text-xs">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;