import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

/**
 * To POST multiple site settings, pass a property of ''
 */
export default function usePutSiteSetting() {
  return usePost({
    deriveUrl: ({ property }) => `/site-settings/data/${property}`,
    deriveData: ({ data }) => ({
      value: data,
    }),
    fetchKeys: [
      queryKeys.settingsSchema,
      queryKeys.twitterBotTestResults,
    ],
  });
}
