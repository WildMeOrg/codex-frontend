import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePutSiteSettings() {
  return usePost({
    url: '/site-settings/data/',
    deriveData: ({ data }) => data,
    fetchKeys: [
      queryKeys.settingsConfig,
      queryKeys.twitterBotTestResults,
    ],
  });
}
