import { usePatch } from '../../hooks/useMutate';
import { getAGSQueryKey } from '../../constants/queryKeys';

export default function useAddAnnotationsToAGSEncounter() {
  return usePatch({
    deriveUrl: ({ agsGuid, encounterGuid }) =>
      `/asset_groups/sighting/${agsGuid}/encounter/${encounterGuid}`,
    deriveData: ({ annotationGuids }) =>
      annotationGuids.map(guid => ({
        op: 'add',
        path: '/annotations',
        value: guid,
      })),
    deriveFetchKeys: ({ agsGuid }) => [getAGSQueryKey(agsGuid)],
  });
}
