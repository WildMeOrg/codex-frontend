import useGet from '../../hooks/useGet';
import { getUserSightingsQueryKey } from '../../constants/queryKeys';

export default function useGetUserSightings(userId) {
  return useGet({
    queryKey: getUserSightingsQueryKey(userId),
    url: `/users/${userId}/sightings`,
  });
}
