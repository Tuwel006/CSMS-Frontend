import { useState } from 'react';
import { X, Rocket, Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  originalPrice?: number;
  badge?: string;
  highlight?: boolean;
}

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  plans: PricingPlan[];
  features: string[];
  onSubscribe: (planId: string, amount: number) => void;
}

const PremiumModal = ({
  title,
  description,
  plans,
  features,
  isOpen,
  onClose,
  onSubscribe
}: PremiumModalProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl border border-slate-300 bg-gradient-to-br from-white via-slate-100 to-slate-200"
        style={{
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Rocket className="text-blue-400" size={22} />
            <span className="text-blue-700 font-bold text-lg tracking-wide">Premium Feature</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X size={24} />
          </button>
        </div>

        {/* Body (scrollable if needed) */}
        <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: '60vh' }}>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1">{title || 'Premium Features'}</h2>
          <p className="text-slate-600 mb-6 text-base">{description || 'Upgrade to unlock premium features'}</p>

          {/* Plan Selection */}
          <div className="mb-6">
            <h3 className="text-blue-600 font-semibold mb-2 text-base">Choose Your Plan:</h3>
            <div className="flex flex-col gap-3">
              {plans && plans.length > 0 ? plans.map((plan) => (
                <label
                  key={plan.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all
                    ${selectedPlanId === plan.id
                      ? 'border-blue-400 bg-blue-50'
                      : plan.highlight
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-slate-200 bg-white'}
                    hover:border-blue-300`}
                >
                  <input
                    type="radio"
                    name="premium-plan"
                    value={plan.id}
                    checked={selectedPlanId === plan.id}
                    onChange={() => setSelectedPlanId(plan.id)}
                    className="accent-blue-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-base ${plan.highlight ? 'text-yellow-700' : 'text-blue-700'}`}>
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold ml-2 shadow">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-lg font-bold ${plan.highlight ? 'text-yellow-700' : 'text-blue-700'}`}>
                        ${plan.price}
                      </span>
                      <span className="text-sm text-slate-500">/ {plan.period}</span>
                      {plan.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">${plan.originalPrice}</span>
                      )}
                      {plan.originalPrice && (
                        <span className="text-green-600 text-xs font-bold ml-2">
                          Save ${(plan.originalPrice - plan.price).toFixed(2)} ({Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              )) : <div className="text-slate-700">No plans available</div>}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-blue-600 font-semibold mb-2 text-base">What's Included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features && features.length > 0 ? features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="text-green-500" size={16} />
                  <span className="text-slate-700 text-sm">{feature}</span>
                </div>
              )) : <div className="text-slate-700">No features listed</div>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-100 to-slate-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-lg font-semibold hover:bg-slate-200 transition-colors shadow"
          >
            Maybe Later
          </button>
          <button
            disabled={!selectedPlan}
            onClick={() => selectedPlan && onSubscribe(selectedPlan.id, selectedPlan.price)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors shadow
              ${selectedPlan
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-300 hover:to-blue-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;