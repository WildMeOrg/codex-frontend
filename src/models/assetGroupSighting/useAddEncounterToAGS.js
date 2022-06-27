import { usePatch } from '../../hooks/useMutate';
import { getAGSQueryKey } from '../../constants/queryKeys';

export default function useAddEncounterToAGS() {
  return usePatch({
    deriveUrl: ({ sightingGuid }) =>
      `/asset_groups/sighting/${sightingGuid}`,
    deriveData: ({ operations }) => operations,
    deriveFetchKeys: ({ sightingGuid }) => [
      getAGSQueryKey(sightingGuid),
    ],
  });
}
