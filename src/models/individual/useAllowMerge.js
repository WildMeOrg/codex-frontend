import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useAllowMerge() {
  return usePost({
    deriveUrl: ({ mergeRequestId }) =>
      `/individuals/merge_request/${mergeRequestId}`,
    data: { vote: 'allow' },
    invalidateKeys: [queryKeys.allNotifications],
  });
}
