import { useDelete } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useDeleteUser() {
  return useDelete({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ userGuid, password }) => {
      const userDeleteData = {
        op: 'remove',
        path: `/users/${userGuid}`,
        value: userGuid,
      };
      const passwordTest = {
        op: 'test',
        path: '/current_password',
        value: password,
      };
      return [passwordTest, userDeleteData];
    },
    fetchKeys: [queryKeys.users],
  });
}
