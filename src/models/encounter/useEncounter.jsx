import { getEncounterQueryKey } from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useEncounter(encounterGuid) {
  return useFetch({
    queryKey: getEncounterQueryKey(encounterGuid),
    url: `/encounters/${encounterGuid}`,
    queryOptions: {
      enabled: Boolean(encounterGuid),
    },
  });
}
