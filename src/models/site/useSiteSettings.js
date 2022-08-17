import useFetch from '../../hooks/useFetch';
import queryKeys from '../../constants/queryKeys';

export default function useGetSiteSettings() {
  return useFetch({
    queryKey: queryKeys.settingsSchema,
    url: '/site-settings/data',
    dataAccessor: result => result?.data?.data,
  });
}
