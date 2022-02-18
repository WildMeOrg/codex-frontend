import queryKeys from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

const limit = 20;
const offset = 0;

export default function useGetUsers() {
  return useGet({
    queryKey: queryKeys.users,
    url: '/users/',
    data: {
      limit,
      offset,
    },
  });
}
