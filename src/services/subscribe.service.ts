import apiClient from '../utils/api';

export interface RoleUpdatePayload {
  role: string;
}

export class SubscribeService {
  static async subscribeRoleUpdate(payload: RoleUpdatePayload): Promise<any> {
    return await apiClient.post('/role_update', payload);;
  }
}
