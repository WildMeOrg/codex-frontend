import { getUserAgsQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

const limit = 20;
const offset = 0;

export default function useGetUserUnprocessedAssetGroupSightings(
  userId,
) {
  return useFetch({
    queryKey: getUserAgsQueryKey(userId),
    url: `/users/${userId}/asset_group_sightings`,
    data: {
      limit,
      offset,
    },
    queryOptions: {
      refetchOnMount: 'always',
    },
  });
}
