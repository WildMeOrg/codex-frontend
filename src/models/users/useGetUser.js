import { getUserQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetUser(userId) {
  return useFetch({
    queryKey: getUserQueryKey(userId),
    url: `/users/${userId}`,
  });
}
