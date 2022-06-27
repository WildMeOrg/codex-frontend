import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

const limit = 20;
const offset = 0;

export default function useGetUsers() {
  return useFetch({
    queryKey: queryKeys.users,
    url: '/users/',
    data: {
      limit,
      offset,
    },
  });
}
