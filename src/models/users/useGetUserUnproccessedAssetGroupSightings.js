import { get } from 'lodash-es';
import { getUserAgsQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetUserUnprocessedAssetGroupSightings(
  userId,
  params = {},
) {
  return useFetch({
    queryKey: getUserAgsQueryKey(userId, params),
    url: `/users/${userId}/asset_group_sightings`,
    params: {
      limit: 20,
      offset: 0,
      ...params,
    },
    dataAccessor: result => {
      const resultCountString = get(result, [
        'data',
        'headers',
        'x-total-count',
      ]);
      return {
        resultCount: parseInt(resultCountString, 10),
        results: get(result, ['data', 'data']),
      };
    },
    queryOptions: {
      retry: 2,
    },
  });
}
