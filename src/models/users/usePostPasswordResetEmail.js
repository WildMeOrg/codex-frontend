import { usePost } from '../../hooks/useMutate';

export default function usePostPasswordResetEmail() {
  return usePost({
    url: '/users/reset_password_email/',
    deriveData: ({ email }) => ({ email }),
  });
}
