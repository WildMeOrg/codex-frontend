import { usePatch } from '../../hooks/useMutate';
import {
  getSightingQueryKey,
  getIndividualQueryKey,
} from '../../constants/queryKeys';

export default function useAssignEncountersToIndividual() {
  return usePatch({
    deriveUrl: ({ individualGuid }) =>
      `/individuals/${individualGuid}`,
    deriveData: ({ encounterGuids }) =>
      encounterGuids.map(encounterGuid => ({
        op: 'add',
        path: '/encounters',
        value: encounterGuid,
      })),
    deriveFetchKeys: ({ individualGuid, sightingGuid }) => {
      const fetchKeys = [getIndividualQueryKey(individualGuid)];
      if (sightingGuid)
        fetchKeys.push(getSightingQueryKey(sightingGuid));
      return fetchKeys;
    },
  });
}
