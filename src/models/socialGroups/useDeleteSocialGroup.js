import { useDelete } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function useDeleteSocialGroup() {
  return useDelete({
    deriveUrl: ({ guid }) => `/social-groups/${guid}`,
    fetchKeys: [queryKeys.socialGroups],
  });
}
