import useFetch from '../../hooks/useFetch';
import { getUserSightingsQueryKey } from '../../constants/queryKeys';

export default function useGetUserSightings(userGuid) {
  const query = { term: { 'owners.guid': userGuid } };

  return useFetch({
    method: 'post',
    url: '/sightings/search',
    queryKey: getUserSightingsQueryKey(userGuid),
    data: query,
    /* Return up to 20 sightings, most recently reported first */
    params: {
      limit: 20,
      offset: 0,
      sort: 'created',
      reverse: true,
    },
    queryOptions: {
      enabled: Boolean(userGuid),
    },
  });
}
