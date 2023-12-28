import { get } from 'lodash-es';
import useFetch from '../../hooks/useFetch';
import { getUserSightingsQueryKey } from '../../constants/queryKeys';

export default function useGetUserSightings(userGuid, params) {
  const query = { term: { 'owners.guid': userGuid } };

  return useFetch({
    method: 'post',
    url: '/sightings/search',
    queryKey: getUserSightingsQueryKey(userGuid, query, params),
    data: query,
    /* Return up to 20 sightings, most recently reported first */
    params: {
      limit: 20,
      offset: 0,
      sort: 'created',
      reverse: false,
      ...params,
    },
    queryOptions: {
      enabled: Boolean(userGuid),
      retry: 2,
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
  });
}
