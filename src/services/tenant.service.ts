import { createTenantPayload, Tenant, TenantDashboard } from "@/types/tenant";
import { ApiResponse } from "@/types/api";
import apiClient from "@/utils/api";

export class tenantService {
    static createTenant = async (body: createTenantPayload): Promise<ApiResponse<Tenant>> => 
        await apiClient.post('tenant/tenants/create', body);
    
    static getTenantDashboard = async (): Promise<ApiResponse<TenantDashboard>> => 
        await apiClient.get('tenant/tenants/dashboard');
}