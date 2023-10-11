import { useMemo } from 'react';
import { get, startCase } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import sexOptions from '../../constants/sexOptions';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';
import { defaultIndividualCategories } from '../../constants/fieldCategories';
import { deriveIndividualName } from '../../utils/nameUtils';

export default function useIndividualFieldSchemas() {
  const { data, loading, error } = useSiteSettings();

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
  
  const individualFieldSchemas = useMemo(() => {
    if (loading || error) return [];

    const customFields = get(
      data,
      ['site.custom.customFields.Individual', 'value', 'definitions'],
      [],
    );
    const customFieldSchemas = customFields.map(
      createCustomFieldSchema,
    );

    return [
      createFieldSchema(fieldTypes.string, {
        name: 'firstName',
        labelId: 'FIRST_NAME',
        category: defaultIndividualCategories.general.name,
        requiredForIndividualCreation: true,
        required: true,
        defaultValue: '',
        getValue: (_, individualData) =>
          deriveIndividualName(individualData, 'FirstName', ''),
      }),
      createFieldSchema(fieldTypes.string, {
        name: 'adoptionName',
        labelId: 'ADOPTION_NAME',
        category: defaultIndividualCategories.general.name,
        requiredForIndividualCreation: true,
        defaultValue: '',
        getValue: (_, individualData) =>
          deriveIndividualName(individualData, 'AdoptionName', ''),
      }),
      createFieldSchema(fieldTypes.select, {
        name: 'sex',
        labelId: 'SEX',
        category: defaultIndividualCategories.general.name,
        choices: sexOptions,
        requiredForIndividualCreation: true,
        defaultValue: null,
      }),
      createFieldSchema(fieldTypes.select, {
        name: 'taxonomy',
        labelId: 'SPECIES',
        category: defaultIndividualCategories.general.name,
        choices: speciesOptions,
        requiredForIndividualCreation: true,
        required: true,
        defaultValue: null,
      }),
      ...customFieldSchemas,
    ];
  }, [data, loading, error]);

  return individualFieldSchemas;
}
