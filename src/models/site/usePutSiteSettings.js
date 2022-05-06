import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePutSiteSettings() {
  return usePost({
    url: '/site-settings/main/',
    deriveData: ({ data }) => data,
    fetchKeys: [queryKeys.settingsConfig],
  });
}
