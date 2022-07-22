import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useSocialGroups(queryOptions = {}) {
  return useFetch({
    queryKey: queryKeys.socialGroups,
    url: `/social-groups`,
    queryOptions,
  });
}
