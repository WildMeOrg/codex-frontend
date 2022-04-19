import { usePatch } from '../../hooks/useMutate';
import { getAGSQueryKey } from '../../constants/queryKeys';

export default function usePatchAGS() {
  return usePatch({
    deriveUrl: ({ agsGuid }) =>
      `/asset_groups/sighting/as_sighting/${agsGuid}`,
    deriveData: ({ data }) => data,
    deriveFetchKeys: ({ agsGuid }) => [getAGSQueryKey(agsGuid)],
  });
}
