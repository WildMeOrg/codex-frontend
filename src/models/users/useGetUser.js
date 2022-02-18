import { getUserQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useGetUser(userId) {
  return useGet({
    queryKey: getUserQueryKey(userId),
    url: `/users/${userId}`,
  });
}
