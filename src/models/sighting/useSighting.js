import { getSightingQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useSighting(sightingId, config = {}) {
  return useFetch({
    queryKey: getSightingQueryKey(sightingId),
    url: `/sightings/${sightingId}`,
    queryOptions: {
      retry: 1,
      refetchInterval: config.refetch ? 5000 : false,
      enabled: Boolean(sightingId) && !config.disabled,
    },
  });
}
