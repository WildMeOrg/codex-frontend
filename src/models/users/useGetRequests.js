import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetRequests() {
  return useFetch({
    queryKey: queryKeys.users,
    url: '/account-requests/',
  });
}
