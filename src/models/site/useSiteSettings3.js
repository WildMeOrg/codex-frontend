import useFetch from '../../hooks/useFetch';
import queryKeys from '../../constants/queryKeys';

export default function useGetSiteSettings() {
  return useFetch({
    queryKey: queryKeys.settingsConfig,
    url: '/site-settings/data',
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });
}
