import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useAllowMerge() {
  return usePost({
    deriveUrl: ({ mergeRequestId }) =>
      `/individuals/merge_requests/${mergeRequestId}`,
    data: {
      vote: 'allow',
    },
    invalidateKeys: [queryKeys.allNotifications],
  });
}
