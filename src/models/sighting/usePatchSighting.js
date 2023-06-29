import { usePatch } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';
import formatPropertiesForPatch from '../../utils/formatPropertiesForPatch';
import { formatUTCTimeToLocalTimeWithTimezone } from '../../utils/formatters';

export default function usePatchSighting() {
  const regex = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
  return usePatch({
    deriveUrl: ({ sightingGuid }) => `/sightings/${sightingGuid}`,
    deriveData: ({ properties, data }) => {
      const customFields = properties['customFields'];
      const newCustomFields = {};
      for(const key in customFields) {
        const value = customFields[key];
        if(Array.isArray(customFields[key])) {
          const newValue = [];
          for(const item of value) {
            if( item && regex.test(JSON.stringify(item))) {
              const adjustedTimestampWithOffset = formatUTCTimeToLocalTimeWithTimezone(item);
              newValue.push(adjustedTimestampWithOffset);
            }else {
              newValue.push(item);
            }
          }
          newCustomFields[key] = newValue;
        } else {
          if( value && regex.test(JSON.stringify(value))) {
            const adjustedTimestampWithOffset = formatUTCTimeToLocalTimeWithTimezone(value);
            newCustomFields[key] = adjustedTimestampWithOffset;
          }else {
            newCustomFields[key] = value;
          }
        } 
      }
      properties['customFields'] = newCustomFields;
      if (data) return data;
      return formatPropertiesForPatch(properties);
    },
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
