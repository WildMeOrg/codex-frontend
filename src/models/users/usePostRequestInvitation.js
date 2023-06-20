import { usePost } from '../../hooks/useMutate';

export default function usePostRequestInvitation() {
  return usePost({
    url: '/account-requests/',
    deriveData: ({ email, name, message,token }) => ({      
      'name' : name,
      'email': email,
      'message' :message,
      'token' : token
    }),
  });
}
