import { useMutation } from 'react-query';
import { subscribeRoleUpdate, RoleUpdatePayload } from '../services/subscribe.service';

const useRoleUpdate = () => {
  return useMutation((payload: RoleUpdatePayload) => subscribeRoleUpdate(payload));
};

export default useRoleUpdate;

