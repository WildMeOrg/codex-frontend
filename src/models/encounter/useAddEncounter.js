import { usePatch } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';

export default function useAddEncounter() {
  return usePatch({
    deriveUrl: ({ sightingGuid }) => `/sightings/${sightingGuid}`,
    deriveData: ({ operations }) => operations,
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
