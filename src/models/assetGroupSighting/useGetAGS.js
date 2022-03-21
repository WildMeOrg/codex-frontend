import { getAGSQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetAGS(assetGroupSightingId, disabled) {
  return useFetch({
    queryKey: getAGSQueryKey(assetGroupSightingId),
    url: `/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
    queryOptions: {
      refetchInterval: 5000,
      enabled: Boolean(assetGroupSightingId) && !disabled,
    },
  });
}
