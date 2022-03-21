import useFetch from '../../hooks/useFetch';
import { getUserSightingsQueryKey } from '../../constants/queryKeys';

export default function useGetUserSightings(userId) {
  return useFetch({
    queryKey: getUserSightingsQueryKey(userId),
    url: `/users/${userId}/sightings`,
  });
}
