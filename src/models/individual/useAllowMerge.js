import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useAllowMerge(mergeRequestId) {
  console.log('deleteMe mergeRequestId is useAllowMerge call is: ');
  console.log(mergeRequestId);
  return usePost({
    // deriveUrl: mergeRequestId => {
    //   console.log('deleteMe mergeRequestId in useAllowMerge is: ');
    //   console.log(mergeRequestId);
    //   return `/individuals/merge_requests/${mergeRequestId}`;
    // },
    url: `/individuals/merge_requests/${mergeRequestId}`,
    data: { vote: 'allow' },
    invalidateKeys: [queryKeys.allNotifications],
  });
}
