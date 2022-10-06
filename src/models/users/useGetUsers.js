import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetUsers() {
  return useFetch({
    queryKey: queryKeys.users,
    url: '/users/',
  });
}
