import { usePost } from '../../hooks/useMutate';

export default function useResendVerificationEmail() {
  return usePost({
    url: '/users/verify_account_email',
  });
}
