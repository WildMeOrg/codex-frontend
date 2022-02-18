import { getUserAgsQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

const limit = 20;
const offset = 0;

export default function useGetUserUnprocessedAssetGroupSightings(
  userId,
) {
  return useGet({
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
