import { get } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';

export default function useSightingFieldSchemas() {
  const { data, loading, error } = useSiteSettings();
  if (loading || error) return null;

  const regionChoices = get(
    data,
    ['site.custom.regions', 'value', 'locationID'],
    [],
  );

  const customFields = get(
    data,
    ['site.custom.customFields.Encounter', 'value', 'definitions'],
    [],
  );
  const customFieldSchemas = customFields.map(
    createCustomFieldSchema,
  );

  return [
    createFieldSchema(fieldTypes.date, {
      name: 'time',
      labelId: 'SIGHTING_TIME',
    }),
    createFieldSchema(fieldTypes.locationId, {
      name: 'locationId',
      labelId: 'REGION',
      choices: regionChoices,
    }),
    createFieldSchema(fieldTypes.latlong, {
      name: 'gps',
      labelId: 'EXACT_LOCATION',
      getValue: (_, encounterData) => {
        const lat = get(encounterData, 'decimalLatitude');
        const long = get(encounterData, 'decimalLongitude');
        return lat && long ? [lat, long] : null;
      },
    }),
    createFieldSchema(fieldTypes.string, {
      name: 'verbatimLocality',
      labelId: 'FREEFORM_LOCATION',
    }),
    ...customFieldSchemas,
  ];
}
