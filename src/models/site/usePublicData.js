import useFetch from '../../hooks/useFetch';
import queryKeys from '../../constants/queryKeys';

export default function usePublicData() {
  return useFetch({
    queryKey: queryKeys.publicData,
    url: '/site-settings/public-data',
  });
}
