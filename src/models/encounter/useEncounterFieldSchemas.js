import { useMemo } from 'react';
import { get, startCase } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';

export const defaultEncounterCategories = {
  animal: {
    name: 'individual',
    labelId: 'INDIVIDUAL_INFORMATION',
    individualFields: true,
  },
};

const sexChoices = [
  // biologists not yet woke
  {
    value: 'male',
    labelId: 'MALE',
  },
  {
    value: 'female',
    labelId: 'FEMALE',
  },
  {
    value: 'unknown',
    labelId: 'UNKNOWN',
  },
];

export default function useSightingFieldSchemas() {
  const {
    data,
    loading,
    error,
    siteSettingsVersion,
  } = useSiteSettings();
  if (loading || error) return null;

  const encounterFieldSchemas = useMemo(
    () => {
      const regionChoices = get(
        data,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      );

      const species = get(data, ['site.species', 'value'], []);
      const speciesOptions = species.map(s => {
        const mainCommonName = startCase(get(s, ['commonNames', 0]));
        const speciesLabel = mainCommonName
          ? `${mainCommonName} (${s.scientificName})`
          : s.scientificName;
        return {
          label: speciesLabel,
          value: s.id,
        };
      });

      const customFields = get(
        data,
        [
          'site.custom.customFields.Encounter',
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
          name: 'time',
          labelId: 'SIGHTING_TIME',
          category: defaultEncounterCategories.animal.name,
          hideOnBasicReport: true,
        }),
        createFieldSchema(fieldTypes.locationId, {
          name: 'locationId',
          labelId: 'REGION',
          choices: regionChoices,
          category: defaultEncounterCategories.animal.name,
          hideOnBasicReport: true,
        }),
        createFieldSchema(fieldTypes.latlong, {
          name: 'gps',
          labelId: 'EXACT_LOCATION',
          getValue: (_, encounterData) => {
            const lat = get(encounterData, 'decimalLatitude');
            const long = get(encounterData, 'decimalLongitude');
            return lat && long ? [lat, long] : [null, null];
          },
          hideOnBasicReport: true,
          category: defaultEncounterCategories.animal.name,
        }),
        createFieldSchema(fieldTypes.string, {
          name: 'verbatimLocality',
          labelId: 'FREEFORM_LOCATION',
          category: defaultEncounterCategories.animal.name,
          hideOnBasicReport: true,
        }),
        createFieldSchema(fieldTypes.select, {
          name: 'taxonomy',
          labelId: 'SPECIES',
          category: defaultEncounterCategories.animal.name,
          choices: speciesOptions,
        }),
        createFieldSchema(fieldTypes.select, {
          name: 'sex',
          labelId: 'SEX',
          category: defaultEncounterCategories.animal.name,
          choices: sexChoices,
        }),
        ...customFieldSchemas,
      ];
    },
    [siteSettingsVersion],
  );

  return encounterFieldSchemas;
}
