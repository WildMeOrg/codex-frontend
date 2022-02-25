import { getSightingQueryKey } from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

export default function useSighting(sightingId) {
  return useGet({
    queryKey: getSightingQueryKey(sightingId),
    url: `/sightings/${sightingId}`,
    queryOptions: {
      refetchInterval: 5000,
      enabled: Boolean(sightingId),
    },
  });
}
