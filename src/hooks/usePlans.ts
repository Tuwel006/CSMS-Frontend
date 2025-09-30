import { useState, useEffect } from 'react';
import PlansService from '../services/plans.service';

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

interface UsePlansReturn {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const usePlans = (): UsePlansReturn => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PlansService.getPlans();
      setPlans(response.data.plans);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans
  };
};

export default usePlans;