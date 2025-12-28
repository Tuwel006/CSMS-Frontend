export interface RoleUpdatePayload {
  userId: string;
  role: string;
}

export const subscribeRoleUpdate = async (_payload: RoleUpdatePayload) => {
  // Implementation placeholder
  return Promise.resolve();
};

export const SubscribeService = {
  subscribeRoleUpdate
};