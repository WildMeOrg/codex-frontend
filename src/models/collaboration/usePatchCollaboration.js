import { usePatch } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePatchCollaboration() {
  return usePatch({
    deriveUrl: ({ collaborationGuid }) =>
      `/collaborations/${collaborationGuid}`,
    deriveData: ({ operations }) => operations,
    fetchKeys: [queryKeys.me, queryKeys.collaborations],
  });
}
