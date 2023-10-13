import { getSightingQueryKey } from '../../constants/queryKeys';
import { usePatch } from '../../hooks/useMutate';

export default function useReviewSighting() {
  return usePatch({
    deriveUrl: ({ sightingGuid }) => `/sightings/${sightingGuid}`,
    deriveData: ({ operations }) => operations,
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
