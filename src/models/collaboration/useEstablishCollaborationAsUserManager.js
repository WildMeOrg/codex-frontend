import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useEstablishCollaborationAsUserManager() {
  return usePost({
    url: '/collaborations/',
    deriveData: ({ user1Guid, user2Guid }) => ({
      user_guid: user1Guid,
      second_user_guid: user2Guid,
    }),
    fetchKeys: [queryKeys.collaborations],
  });
}
