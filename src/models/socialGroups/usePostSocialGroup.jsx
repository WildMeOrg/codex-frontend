import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePostSocialGroup()
{
  return usePost({
    url: '/social-groups/',
    deriveData: ({ name }) => ({
      name
    }),
    fetchKeys: [queryKeys.socialGroups],
  });
}
