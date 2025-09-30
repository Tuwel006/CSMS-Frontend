import { Check, Star, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  billing_cycle: string;
  is_popular: boolean;
  analytics_enabled: boolean;
  custom_branding: boolean;
  api_access: boolean;
  priority_support: boolean;
  live_streaming: boolean;
  advanced_reporting: boolean;
  max_matches_per_month: number | null;
  max_tournaments_per_month: number | null;
  max_users: number | null;
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: number) => void;
  className?: string;
}

const PlanCard = ({ plan, onSelect, className }: PlanCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const features = [
    { key: 'matches', label: `${plan.max_matches_per_month || 'Unlimited'} matches/month`, show: true },
    { key: 'tournaments', label: `${plan.max_tournaments_per_month || 'Unlimited'} tournaments/month`, show: true },
    { key: 'users', label: `${plan.max_users || 'Unlimited'} users`, show: true },
    { key: 'analytics', label: 'Analytics & Reports', show: plan.analytics_enabled },
    { key: 'branding', label: 'Custom Branding', show: plan.custom_branding },
    { key: 'api', label: 'API Access', show: plan.api_access },
    { key: 'support', label: 'Priority Support', show: plan.priority_support },
    { key: 'streaming', label: 'Live Streaming', show: plan.live_streaming },
    { key: 'reporting', label: 'Advanced Reporting', show: plan.advanced_reporting }
  ].filter(f => f.show);

  return (
    <div 
      className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl ${
        plan.is_popular 
          ? isDark 
            ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-purple-400 shadow-purple-500/25' 
            : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-400 shadow-purple-500/25'
          : isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 hover:border-gray-500' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg'
      } ${className}`}
      onClick={() => onSelect(plan.id)}
    >
      {plan.is_popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          }`}>
            <Star size={12} className="animate-pulse" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-5">
        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
        <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
        
        <div className="flex items-baseline justify-center gap-1 mb-3">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.currency}</span>
          <span className={`text-3xl font-bold ${plan.is_popular ? (isDark ? 'text-purple-300' : 'text-purple-600') : (isDark ? 'text-white' : 'text-gray-900')}`}>{plan.price}</span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/{plan.billing_cycle}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {features.slice(0, 4).map((feature) => (
          <div key={feature.key} className="flex items-center gap-2">
            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
            }`}>
              <Check size={10} />
            </div>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{feature.label}</span>
          </div>
        ))}
        {features.length > 4 && (
          <div className={`text-xs text-center pt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            +{features.length - 4} more features
          </div>
        )}
      </div>

      <button 
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
          plan.is_popular 
            ? isDark
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25'
            : isDark 
              ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600'
              : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white shadow-md'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plan.id);
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <Zap size={14} className={plan.is_popular ? 'animate-pulse' : ''} />
          Choose Plan
        </div>
      </button>
    </div>
  );
};

export default PlanCard;