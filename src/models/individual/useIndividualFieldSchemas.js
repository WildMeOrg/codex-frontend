import { useMemo } from 'react';
import { get } from 'lodash-es';

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
      ...customFieldSchemas,
    ];
  }, [data, loading, error]);

  return individualFieldSchemas;
}
