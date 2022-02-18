import { getAGSQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useAssetGroupSighting(assetGroupSightingId) {
  return useGet({
    queryKey: getAGSQueryKey(assetGroupSightingId),
    url: `/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
    queryOptions: {
      refetchInterval: 5000,
      enabled: Boolean(assetGroupSightingId),
    },
  });
}
