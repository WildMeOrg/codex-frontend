import { getAssetGroupQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useAssetGroup(assetGroupId) {
  return useGet({
    queryKey: getAssetGroupQueryKey(assetGroupId),
    url: `/asset_groups/${assetGroupId}`,
  });
}
