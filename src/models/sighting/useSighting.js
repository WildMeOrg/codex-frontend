import { getSightingQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useSighting(sightingId) {
  return useFetch({
    queryKey: getSightingQueryKey(sightingId),
    url: `/sightings/${sightingId}`,
    queryOptions: {
      refetchInterval: 5000,
      enabled: Boolean(sightingId),
    },
  });
}
