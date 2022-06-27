import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePostUser() {
  return usePost({
    url: '/users/',
    deriveData: ({ email, password, roles }) => ({
      email,
      password,
      roles,
    }),
    fetchKeys: [queryKeys.users],
  });
}
