import { getSocialGroupQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useSocialGroup(guid, queryOptions = {}) {
  return useFetch({
    queryKey: getSocialGroupQueryKey(guid),
    url: `/social-groups/${guid}`,
    queryOptions: {
      enabled: Boolean(guid),
      ...queryOptions,
    },
  });
}
