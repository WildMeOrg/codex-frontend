import { getAGSQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useGetAGS(assetGroupSightingId, disabled) {
  return useGet({
    queryKey: getAGSQueryKey(assetGroupSightingId),
    url: `/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
    queryOptions: {
      refetchInterval: 5000,
      enabled: Boolean(assetGroupSightingId) && !disabled,
    },
  });
}
