import { usePost } from '../../hooks/useMutate';

export default function usePostPasswordReset() {
  return usePost({
    deriveUrl: ({ code }) => `/auth/code/${code}.json`,
    deriveData: ({ password }) => ({ password }),
  });
}
