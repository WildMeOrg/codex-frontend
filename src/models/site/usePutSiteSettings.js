import { usePost } from '../../hooks/useMutate';
import queryKeys from '../../constants/queryKeys';

export default function usePutSiteSettings() {
  const putSiteSettings = usePost({
    url: '/site-settings/main/',
    deriveData: ({ data }) => data,
    fetchKeys: [queryKeys.settingsConfig],
  });

  const putSiteSetting = usePost({
    deriveUrl: ({ property }) => `/site-settings/main/${property}`,
    deriveData: ({ data }) => ({
      _value: data,
    }),
    fetchKeys: [queryKeys.settingsConfig],
  });

  return { putSiteSettings, putSiteSetting };
}
