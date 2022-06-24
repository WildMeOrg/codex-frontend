import { getAGSQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetAGS(assetGroupSightingId, config = {}) {
  return useFetch({
    queryKey: getAGSQueryKey(assetGroupSightingId),
    url: `/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
    queryOptions: {
      retry: 1,
      refetchInterval: config.refetch ? 5000 : false,
      enabled: Boolean(assetGroupSightingId) && !config.disabled,
    },
  });
}
