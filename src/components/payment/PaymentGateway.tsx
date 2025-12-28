import { useState } from 'react';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import Input from '../ui/Input';
import Form from '../ui/Form';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Secure Payment</h2>
                <p className="text-blue-100 text-sm">256-bit SSL encrypted</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              {paymentData.currency} {paymentData.amount.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-500">{paymentData.description}</p>
        </div>

        <Form 
          onSubmit={handleSubmit}
          variant="minimal"
          layout="single"
          spacing="md"
          loading={isProcessing}
          containerClassName="p-6"
          footerSlot={
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          }
        >
          <Input
            type="text"
            label="Card Number"
            value={cardNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            leftIcon={<CreditCard size={20} />}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="Expiry Date"
              value={expiryDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              required
            />
            <Input
              type="text"
              label="CVV"
              value={cvv}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              maxLength={4}
              required
            />
          </div>

          <Input
            type="text"
            label="Cardholder Name"
            value={cardName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </Form>

        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle size={14} className="text-green-500" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;