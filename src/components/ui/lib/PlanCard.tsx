import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';
import { Check, Star } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  billing_cycle: string;
  max_matches_per_month: number | null;
  max_tournaments_per_month: number | null;
  max_users: number | null;
  analytics_enabled: boolean;
  custom_branding: boolean;
  api_access: boolean;
  priority_support: boolean;
  live_streaming: boolean;
  advanced_reporting: boolean;
  is_active: boolean;
  is_popular: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: number) => void;
  className?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    { key: 'max_matches_per_month', label: `${plan.max_matches_per_month || 'Unlimited'} matches/month`, enabled: true },
    { key: 'max_tournaments_per_month', label: `${plan.max_tournaments_per_month || 'Unlimited'} tournaments/month`, enabled: true },
    { key: 'max_users', label: `${plan.max_users || 'Unlimited'} users`, enabled: true },
    { key: 'analytics_enabled', label: 'Analytics & Reports', enabled: plan.analytics_enabled },
    { key: 'custom_branding', label: 'Custom Branding', enabled: plan.custom_branding },
    { key: 'api_access', label: 'API Access', enabled: plan.api_access },
    { key: 'priority_support', label: 'Priority Support', enabled: plan.priority_support },
    { key: 'live_streaming', label: 'Live Streaming', enabled: plan.live_streaming },
    { key: 'advanced_reporting', label: 'Advanced Reporting', enabled: plan.advanced_reporting }
  ].filter(f => f.enabled);

  return (
    <div className={cn(
      'relative rounded-xs border transition-all duration-200 hover:shadow-md',
      plan.is_popular 
        ? 'border-blue-500 ring-2 ring-blue-500/20' 
        : isDark ? 'border-gray-700' : 'border-gray-200',
      isDark ? 'bg-gray-800' : 'bg-white',
      className
    )}>
      {plan.is_popular && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="bg-blue-500 text-white px-2 py-0.5 rounded-xs text-[9px] font-semibold flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" />
            POPULAR
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className={cn(
            'text-sm font-bold',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {plan.name}
          </h3>
          <p className={cn(
            'text-[10px] mt-1',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className={cn(
              'text-xs',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {plan.currency}
            </span>
            <span className={cn(
              'text-2xl font-bold',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              {plan.price}
            </span>
            <span className={cn(
              'text-[10px]',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}>
              /{plan.billing_cycle}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1.5 mb-4">
          {features.slice(0, 6).map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className={cn(
                'text-[10px]',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}>
                {feature.label}
              </span>
            </div>
          ))}
          {features.length > 6 && (
            <div className={cn(
              'text-[9px] text-center',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              +{features.length - 6} more features
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(plan.id)}
          className={cn(
            'w-full py-2 px-3 rounded-xs text-xs font-semibold transition-all duration-200',
            plan.is_popular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          )}
        >
          {parseFloat(plan.price) === 0 ? 'Start Free' : 'Choose Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;