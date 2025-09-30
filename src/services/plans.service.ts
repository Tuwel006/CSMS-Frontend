import apiClient from '../utils/api';

interface PlansResponse {
  status: number;
  code: string;
  message: string;
  data: {
    plans: Plan[];
  };
}

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

export class PlansService {
  static async getPlans(): Promise<PlansResponse> {
    return apiClient.get<PlansResponse>('/admin/plans');
  }
}

export default PlansService;