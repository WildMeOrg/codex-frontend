import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePutSiteSetting() {
  return usePost({
    deriveUrl: ({ property }) => `/site-settings/main/${property}`,
    deriveData: ({ data }) => ({
      _value: data,
    }),
    fetchKeys: [queryKeys.settingsConfig, queryKeys.twitterBot],
  });
}
