import useFetch from '../../hooks/useFetch';
import { getUserSightingsQueryKey } from '../../constants/queryKeys';

export default function useGetUserSightings(userGuid) {
  const query = {
    match_phrase_prefix: {
      'owners.guid': {
        query: userGuid,
      },
    },
  };

  return useFetch({
    method: 'post',
    url: '/sightings/search',
    queryKey: getUserSightingsQueryKey(userGuid),
    data: query,
    queryOptions: {
      enabled: Boolean(userGuid),
    },
  });
}
