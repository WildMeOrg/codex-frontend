import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePutSiteSetting() {
  return usePost({
    deriveUrl: ({ property }) => `/site-settings/data/${property}`,
    deriveData: ({ data }) =>  data,
    fetchKeys: [
      queryKeys.settingsConfig,
      queryKeys.twitterBotTestResults,
    ],
  });
}
