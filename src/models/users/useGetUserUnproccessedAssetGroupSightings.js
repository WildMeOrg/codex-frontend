import { getUserAgsQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetUserUnprocessedAssetGroupSightings(
  userId,
  params = {},
) {
  return useFetch({
    queryKey: getUserAgsQueryKey(userId),
    url: `/users/${userId}/asset_group_sightings`,
    params: {
      limit: 20,
      offset: 0,
      ...params,
    },
  });
}
