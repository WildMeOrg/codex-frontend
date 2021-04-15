import { get } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';

const defaultSightingCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
    individualFields: false,
  },
  location: {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_CATEGORY_DESCRIPTION',
    required: true,
    individualFields: false,
  },
  details: {
    name: 'sightingDetails',
    labelId: 'SIGHTING_DETAILS',
    individualFields: false,
  },
};

export default function useSightingFieldSchemas() {
  const { data, loading, error } = useSiteSettings();
  if (loading || error) return null;

  const regionChoices = get(
    data,
    ['site.custom.regions', 'value', 'locationID'],
    [],
  );

  const contextChoices = [
    {
      value: 'research-effort',
      labelId: 'RESEARCH_EFFORT',
    },
    {
      value: 'wildlife-tour',
      labelId: 'WILDLIFE_TOUR',
    },
    {
      value: 'opportunistic-sighting',
      labelId: 'OPPORTUNISTIC_SIGHTING',
    },
  ];

  const customFields = get(
    data,
    ['site.custom.customFields.Occurrence', 'value', 'definitions'],
    [],
  );
  const customFieldSchemas = customFields.map(
    createCustomFieldSchema,
  );

  return [
    createFieldSchema(fieldTypes.select, {
      name: 'context',
      labelId: 'SIGHTING_CONTEXT',
      category: defaultSightingCategories.general.name,
      choices: contextChoices,
    }),
    createFieldSchema(fieldTypes.date, {
      name: 'startTime',
      labelId: 'SIGHTING_START',
      category: defaultSightingCategories.general.name,
    }),
    createFieldSchema(fieldTypes.date, {
      name: 'endTime',
      labelId: 'SIGHTING_END',
      category: defaultSightingCategories.general.name,
    }),
    createFieldSchema(fieldTypes.locationId, {
      name: 'locationId',
      labelId: 'REGION',
      category: defaultSightingCategories.location.name,
      choices: regionChoices,
    }),
    createFieldSchema(fieldTypes.latlong, {
      name: 'gps',
      labelId: 'EXACT_LOCATION',
      category: defaultSightingCategories.location.name,
      getValue: (_, sightingData) => {
        const lat = get(sightingData, 'decimalLatitude');
        const long = get(sightingData, 'decimalLongitude');
        return lat && long ? [lat, long] : null;
      },
    }),
    createFieldSchema(fieldTypes.string, {
      name: 'verbatimLocality',
      labelId: 'FREEFORM_LOCATION',
      category: defaultSightingCategories.location.name,
    }),
    createFieldSchema(fieldTypes.string, {
      name: 'behavior',
      labelId: 'BEHAVIOR',
      category: defaultSightingCategories.details.name,
    }),
    createFieldSchema(fieldTypes.longstring, {
      name: 'comments',
      labelId: 'NOTES',
      category: defaultSightingCategories.details.name,
    }),
    ...customFieldSchemas,
  ];
}
