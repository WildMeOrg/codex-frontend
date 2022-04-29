import { usePatch } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';

export default function useAddAnnotationsToSightingEncounter() {
  return usePatch({
    deriveUrl: ({ encounterGuid }) => `/encounters/${encounterGuid}`,
    deriveData: ({ annotationGuids }) =>
      annotationGuids.map(guid => ({
        op: 'add',
        path: '/annotations',
        value: guid,
      })),
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
