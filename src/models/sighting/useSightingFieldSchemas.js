import { useMemo } from 'react';
import { get } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';

/* temporary fake species detection models */

const backendModels = [
  {
    model_name: 'iotv0',
    description: 'Generic turtle identifier',
    id_algos: ['hotspotter', 'PIEv2'],
    supported_species: [
      {
        common_name: 'Green Turtle',
        sci_name: 'Chelonia mydas',
        itis_id: 202103,
        ia_classes: ['turtle_green', 'turtle_green+head'],
      },
      {
        common_name: 'Hawksbill Turtle',
        sci_name: 'Eretmochelys imbricata',
        itis_id: 208666,
        ia_classes: ['turtle_hawksbill', 'turtle_hawksbill+head'],
      },
    ],
  },
  {
    model_name: 'fins_v1',
    description: 'Best fin detector',
    id_algos: ['hotspotter', 'PIEv2'],
    supported_species: [
      {
        common_name: 'Bottlenose Dolphin',
        sci_name: 'Tursiops Truncatus',
        itis_id: 180426,
        ia_classes: ['bottlenose'],
      },
    ],
  },
];

/* delete this soon */

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

      const siteSpecies = get(data, ['site.species', 'value'], []);
      const siteItisIds = siteSpecies.map(species => species.itisTsn);

      const modelChoices = backendModels.reduce((acc, model) => {
        const siteSupportedSpecies = model.supported_species.filter(
          species => siteItisIds.includes(species.itis_id),
        );

        if (siteSupportedSpecies.length === 0) return acc;

        const speciesLabels = siteSupportedSpecies.map(
          s => `${s.common_name} (${s.sci_name})`,
        );

        return [
          ...acc,
          {
            label: model.description,
            value: model.model_name,
            description: speciesLabels.join(', '),
          },
        ];
      }, []);

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
