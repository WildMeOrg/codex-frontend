import { usePost } from '../../hooks/useMutate';
import { getAGSQueryKey } from '../../constants/queryKeys';

export default function useCommitAssetGroupSighting() {
  return usePost({
    deriveUrl: ({ agsGuid }) =>
      `/asset_groups/sighting/${agsGuid}/commit`,
    deriveFetchKeys: ({ agsGuid }) => [getAGSQueryKey(agsGuid)],
  });
}
