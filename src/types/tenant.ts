export interface createTenantPayload {
    organizationName: string;
    planId: string;
}

export interface Tenant {
    id: number;
    name: string;
    owner_user_id: number;
    plan_id: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Plan {
    id: number;
    name: string;
    maxMatches: number;
    maxTournaments: number;
    maxUsers: number;
}

export interface TenantUsage {
    currentMatches: number;
    currentTournaments: number;
    currentUsers: number;
}

export interface TenantDashboard {
    id: number;
    name: string;
    planId: number;
    plan: Plan;
    usage: TenantUsage;
    createdAt: string;
}