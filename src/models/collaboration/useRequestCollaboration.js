import queryKeys from '../../constants/queryKeys';
import { usePost } from '../../hooks/useMutate';

export default function useRequestCollaboration() {
  return usePost({
    url: '/collaborations/',
    deriveData: ({ userGuid }) => ({ user_guid: userGuid }),
    fetchKeys: [queryKeys.me],
  });
}
