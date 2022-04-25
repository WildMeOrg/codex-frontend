import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useBlockMerge() {
  return usePost({
    deriveUrl: ({ mergeRequestId }) =>
      `/individuals/merge_request/${mergeRequestId}`,
    data: {
      vote: 'block',
    },
    invalidateKeys: [queryKeys.allNotifications],
  });
}
