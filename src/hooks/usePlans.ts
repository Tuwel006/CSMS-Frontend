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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PlansService.getPlans();
      
      console.log('Plans API response:', response);
      
      // Handle the nested structure: data.plans.data
      const responseData: any = response;
      if (responseData?.data?.plans?.data && Array.isArray(responseData.data.plans.data)) {
        setPlans(responseData.data.plans.data);
      } else if (responseData?.data?.plans && Array.isArray(responseData.data.plans)) {
        setPlans(responseData.data.plans);
      } else if (responseData?.plans?.data && Array.isArray(responseData.plans.data)) {
        setPlans(responseData.plans.data);
      } else if (responseData?.plans && Array.isArray(responseData.plans)) {
        setPlans(responseData.plans);
      } else if (Array.isArray(responseData?.data)) {
        setPlans(responseData.data);
      } else if (Array.isArray(responseData)) {
        setPlans(responseData);
      } else {
        console.log('Unexpected plans response structure:', response);
        setPlans([]);
      }
    } catch (err: any) {
      console.error('Plans fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch plans');
      setPlans([]);
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