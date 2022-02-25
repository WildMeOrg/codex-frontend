import queryKeys from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useGetAllCollaborations() {
  return useGet({
    queryKey: queryKeys.collaborations,
    url: '/collaborations',
  });
}
