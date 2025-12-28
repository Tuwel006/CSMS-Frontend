// Stub for missing @tanstack/react-query
interface UseMutationResult {
  mutate: (data: any) => void;
  isLoading: boolean;
}

const useMutation = (_fn: any): UseMutationResult => {
  return {
    mutate: () => {},
    isLoading: false
  };
};

import { subscribeRoleUpdate, RoleUpdatePayload } from '../services/subscribe.service';

const useRoleUpdate = () => {
  return useMutation((payload: RoleUpdatePayload) => subscribeRoleUpdate(payload));
};

export default useRoleUpdate;

