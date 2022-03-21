import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetAllCollaborations() {
  return useFetch({
    queryKey: queryKeys.collaborations,
    url: '/collaborations',
  });
}
