import { useState, useEffect } from 'react';
import { TenantDashboard } from '@/types/tenant';
import { tenantService } from '@/services/tenant.service';

export const useTenantDashboard = () => {
  const [tenantData, setTenantData] = useState<TenantDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenantDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tenantService.getTenantDashboard();
      if (response.data) {
        setTenantData(response.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch tenant data');
      console.error('Error fetching tenant dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantDashboard();
  }, []);

  return {
    tenantData,
    loading,
    error,
    refetch: fetchTenantDashboard,
  };
};
