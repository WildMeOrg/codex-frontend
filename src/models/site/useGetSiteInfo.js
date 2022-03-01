import queryKeys from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useGetSiteInfo() {
  return useGet({
    queryKey: queryKeys.siteInfo,
    url: '/site-settings/site-info/',
  });
}
