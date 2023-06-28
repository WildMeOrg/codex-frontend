import { usePatch } from '../../hooks/useMutate';
import { getSightingQueryKey } from '../../constants/queryKeys';
import formatPropertiesForPatch from '../../utils/formatPropertiesForPatch';

export default function usePatchSighting() {
  return usePatch({
    deriveUrl: ({ sightingGuid }) => `/sightings/${sightingGuid}`,
    deriveData: ({ properties, data }) => {
      console.log('data', data);
      console.log('properties', properties);
      const customFields = properties['customFields'];
      const newCustomFields = {};
      for(const key in customFields) {
        const value = customFields[key];
        if(Array.isArray(customFields[key])) {
          const newValue = [];
          for(const item of value) {
            if( item && /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/.test(JSON.stringify(item))) {
              console.log('1111111111');
              const utcTimestamp = item;
              const date = new Date(utcTimestamp);
              const timezoneOffset = date.getTimezoneOffset();
              const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
              const offsetMinutes = Math.abs(timezoneOffset) % 60;
              const offsetSign = timezoneOffset < 0 ? "+" : "-";
              const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
              const adjustedTimestampWithoutZ = new Date(date.getTime() - timezoneOffset * 60 * 1000).toISOString().slice(0, -1);
              const adjustedTimestampWithOffset = `${adjustedTimestampWithoutZ}${offsetFormatted}`;
              newValue.push(adjustedTimestampWithOffset);
            }else {
              console.log('22222222222');
              newValue.push(item);
            }
          }
          newCustomFields[key] = newValue;
          console.log('newCustomFields', newCustomFields);
        }
        // if( value && /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z")$/.test(JSON.stringify(value))) {
        // if( value && /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/.test(JSON.stringify(value))) {
        //   console.log('=============');
        //   const utcTimestamp = value;
        //   const date = new Date(utcTimestamp);
        //   const timezoneOffset = date.getTimezoneOffset();
        //   const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
        //   const offsetMinutes = Math.abs(timezoneOffset) % 60;
        //   const offsetSign = timezoneOffset < 0 ? "+" : "-";
        //   const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
        //   const adjustedTimestampWithoutZ = new Date(date.getTime() - timezoneOffset * 60 * 1000).toISOString().slice(0, -1);
        //   const adjustedTimestampWithOffset = `${adjustedTimestampWithoutZ}${offsetFormatted}`;
        //   newCustomFields[key] = adjustedTimestampWithOffset;
        // }else {
        //   console.log('>>>>>>>>>>>>>');
        //   newCustomFields[key] = value;
        // }
      }
      properties['customFields'] = newCustomFields;
      console.log('final properties', properties);
      if (data) return data;
      return formatPropertiesForPatch(properties);
    },
    deriveFetchKeys: ({ sightingGuid }) => [
      getSightingQueryKey(sightingGuid),
    ],
  });
}
