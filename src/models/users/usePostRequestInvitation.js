import { usePost } from '../../hooks/useMutate';

export default function usePostRequestInvitation() {
  return usePost({
    url: '/account-requests/',
    deriveData: ({ email, name, message }) => ({      
      'name' : name,
      'email': email,
      'message' :message,
    }),
    // deriveData: ({"name":"someone", "email":"foo@bar", "message": "wassup"})
  });
}
