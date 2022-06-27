import { get } from 'lodash-es';
import { formatHoustonTime } from './formatters';

export default function formatPropertiesForPatch(dictionary) {
  const dictionaryCopy = { ...dictionary };
  if ('gps' in dictionaryCopy) {
    dictionaryCopy.decimalLatitude = get(dictionaryCopy, ['gps', 0]);
    dictionaryCopy.decimalLongitude = get(dictionaryCopy, ['gps', 1]);
    delete dictionaryCopy.gps;
  }

  if ('specifiedTime' in dictionaryCopy) {
    dictionaryCopy.time = formatHoustonTime(
      dictionaryCopy.specifiedTime?.time,
    );
    dictionaryCopy.timeSpecificity =
      dictionaryCopy.specifiedTime?.timeSpecificity;
    delete dictionaryCopy.specifiedTime;
  }

  const operations = Object.keys(dictionaryCopy).map(propertyKey => ({
    op: 'replace',
    path: `/${propertyKey}`,
    value: dictionaryCopy[propertyKey],
  }));

  return operations;
}
