import { getAssetGroupQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useAssetGroup(
  assetGroupId,
  { queryOptions } = {},
) {
  return useFetch({
    queryKey: getAssetGroupQueryKey(assetGroupId),
    url: `/asset_groups/${assetGroupId}`,
    queryOptions,
  });
}
