import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useRequestEditAccess() {
  return usePost({
    deriveUrl: ({ collaborationGuid }) =>
      `/collaborations/edit_request/${collaborationGuid}`,
    fetchKeys: [queryKeys.me],
  });
}
