import { useMemo } from 'react';
import { get } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';

export const defaultSightingCategories = {
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
  const {
    data,
    loading,
    error,
    siteSettingsVersion,
  } = useSiteSettings();
  if (loading || error) return null;

  const sightingFieldSchemas = useMemo(
    () => {
      const regionChoices = get(
        data,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      );

      const customFields = get(
        data,
        [
          'site.custom.customFields.Occurrence',
          'value',
          'definitions',
        ],
        [],
      );
      const customFieldSchemas = customFields.map(
        createCustomFieldSchema,
      );

      return [
        createFieldSchema(fieldTypes.date, {
          name: 'startTime',
          labelId: 'SIGHTING_START',
          descriptionId: 'SIGHTING_START_TIME_DESCRIPTION',
          category: defaultSightingCategories.general.name,
          required: true,
        }),
        createFieldSchema(fieldTypes.date, {
          name: 'endTime',
          labelId: 'SIGHTING_END',
          descriptionId: 'SIGHTING_END_TIME_DESCRIPTION',
          category: defaultSightingCategories.general.name,
        }),
        createFieldSchema(fieldTypes.string, {
          name: 'verbatimEventDate',
          labelId: 'SIGHTING_VERBATIM_TIME',
          descriptionId: 'SIGHTING_VERBATIM_TIME_DESCRIPTION',
          category: defaultSightingCategories.general.name,
        }),
        createFieldSchema(fieldTypes.locationId, {
          name: 'locationId',
          labelId: 'REGION',
          descriptionId: 'REGION_DESCRIPTION',
          category: defaultSightingCategories.location.name,
          choices: regionChoices,
        }),
        createFieldSchema(fieldTypes.string, {
          name: 'verbatimLocality',
          labelId: 'FREEFORM_LOCATION',
          descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
          category: defaultSightingCategories.location.name,
          hideOnBulkReport: true,
        }),
        createFieldSchema(fieldTypes.latlong, {
          name: 'gps',
          labelId: 'EXACT_LOCATION',
          descriptionId: 'LOCATION_DESCRIPTION',
          category: defaultSightingCategories.location.name,
          getValue: (_, sightingData) => {
            const lat = get(sightingData, 'decimalLatitude');
            const long = get(sightingData, 'decimalLongitude');
            return lat && long ? [lat, long] : [null, null];
          },
        }),
        createFieldSchema(fieldTypes.longstring, {
          name: 'comments',
          labelId: 'NOTES',
          category: defaultSightingCategories.details.name,
        }),
        ...customFieldSchemas,
      ];
    },
    [siteSettingsVersion],
  );

  return sightingFieldSchemas;
}
