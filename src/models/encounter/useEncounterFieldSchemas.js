import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get, startCase } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import { defaultEncounterCategories } from '../../constants/fieldCategories';
import fieldTypes from '../../constants/fieldTypesNew';
import sexOptions from '../../constants/sexOptions';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';

export default function useSightingFieldSchemas() {
  const intl = useIntl();
  const { data, loading, error } = useSiteSettings();

  const encounterFieldSchemas = useMemo(() => {
    if (loading || error) return [];

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

    speciesOptions.push({
      label: intl.formatMessage({ id: 'UNKNOWN' }),
      value: null,
    });

    const customFields = get(
      data,
      ['site.custom.customFields.Encounter', 'value', 'definitions'],
      [],
    );
    const customFieldSchemas = customFields.map(
      createCustomFieldSchema,
    );

    return [
      createFieldSchema(fieldTypes.specifiedTime, {
        name: 'specifiedTime',
        labelId: 'SIGHTING_TIME',
        descriptionId: 'SIGHTING_TIME_DESCRIPTION',
        getValue: (_, encounterData) => {
          const timeSpecificity = get(
            encounterData,
            'timeSpecificity',
          );
          const time = get(encounterData, 'time');
          return { time, timeSpecificity };
        },
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
        hideOnBulkReport: true,
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
        defaultValue: null,
      }),
      createFieldSchema(fieldTypes.select, {
        name: 'sex',
        labelId: 'SEX',
        category: defaultEncounterCategories.animal.name,
        choices: sexOptions,
        defaultValue: null,
      }),
      ...customFieldSchemas,
    ];
  }, [intl, loading, error, data]);
  return encounterFieldSchemas;
}
