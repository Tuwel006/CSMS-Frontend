import { useState } from 'react';
import { SubscribeService, type RoleUpdatePayload } from '../services/subscribe.service';

const useSubscribe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const subscribe = async (payload: RoleUpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await SubscribeService.subscribeRoleUpdate(payload);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { subscribe, loading, error };
};

export default useSubscribe;
