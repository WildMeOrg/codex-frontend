import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetSiteInfo() {
  return useFetch({
    queryKey: queryKeys.siteInfo,
    url: '/site-settings/site-info/',
  });
}
