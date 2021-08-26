import { useMemo } from 'react';
import { get, map, omitBy } from 'lodash-es';

import useDetectionConfig from '../site/useDetectionConfig';
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
    loading: siteSettingsLoading,
    error: siteSettingsError,
    siteSettingsVersion,
  } = useSiteSettings();

  const {
    data: detectionConfig,
    loading: detectionConfigLoading,
    error: detectionConfigError,
  } = useDetectionConfig();

  const loading = siteSettingsLoading || detectionConfigLoading;
  const error = siteSettingsError || detectionConfigError;

  const sightingFieldSchemas = useMemo(
    () => {
      if (loading || error) return [];

      const regionChoices = get(
        data,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      );

      const siteSpecies = get(data, ['site.species', 'value'], []);
      const siteItisIds = siteSpecies.map(species => species.itisTsn);

      const relevantDetectionModels = omitBy(
        detectionConfig,
        model => {
          const siteSupportedSpecies = model.supported_species.filter(
            species => siteItisIds.includes(species.itis_id),
          );
          return siteSupportedSpecies.length === 0;
        },
      );

      const modelChoices = map(
        relevantDetectionModels,
        (model, model_value) => {
          const speciesLabels = model.supported_species.map(
            s => `${s.common_name} (${s.scientific_name})`,
          );

          return {
            label: model.name,
            value: model_value,
            description: speciesLabels.join(', '),
          };
        },
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
        createFieldSchema(fieldTypes.multiselect, {
          name: 'speciesDetectionModel',
          labelId: 'SPECIES_DETECTION_MODEL',
          descriptionId: 'SPECIES_DETECTION_MODEL_DESCRIPTION',
          category: defaultSightingCategories.general.name,
          choices: modelChoices,
          hideOnMetadataCard: true,
          editable: false,
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
    [siteSettingsVersion, loading, error],
  );

  return sightingFieldSchemas;
}
