import useFetch from '../../hooks/useFetch';
import queryKeys from '../../constants/queryKeys';

export default function useSiteSettings() {
  return useFetch({
    queryKey: queryKeys.settingsSchema,
    url: '/site-settings/data',
  });
}
