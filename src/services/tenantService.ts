import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';

interface CreateTenantPayload {
  organizationName: string;
  planId: number;
}

interface CreateTenantResponse {
  id: number;
  organizationName: string;
  planId: number;
  createdAt: string;
}

export const TenantService = {
  createTenant: async (payload: CreateTenantPayload): Promise<ApiResponse<CreateTenantResponse>> => {
    return apiClient.post('tenant/tenants/create', payload);
  }
};
