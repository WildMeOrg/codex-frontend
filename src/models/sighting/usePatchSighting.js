import { usePatch } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';
import formatPropertiesForPatch from '../../utils/formatPropertiesForPatch';
import { formatCustomFields } from '../../utils/formatters';

export default function usePatchSighting() {
  return usePatch({
    deriveUrl: ({ sightingGuid }) => `/sightings/${sightingGuid}`,
    deriveData: ({ properties, data }) => {
      const customFields = properties['customFields'];
      const newCustomFields = formatCustomFields(customFields);
      properties['customFields'] = newCustomFields;
      if (data) return data;
      return formatPropertiesForPatch(properties);
    },
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
