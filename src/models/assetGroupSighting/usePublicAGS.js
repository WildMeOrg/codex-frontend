import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function usePublicAGS() {
  return useFetch({
    queryKey: queryKeys.publicAssetGroupSightings,
    url: '/asset_groups/sighting/pending/public',
  });
}
