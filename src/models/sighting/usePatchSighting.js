import { usePatch } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';
import formatPropertiesForPatch from '../../utils/formatPropertiesForPatch';

export default function usePatchSighting() {
  return usePatch({
    deriveUrl: ({ sightingGuid }) => `/sightings/${sightingGuid}`,
    deriveData: ({ properties, data }) => {
      if (data) return data;
      return formatPropertiesForPatch(properties);
    },
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
