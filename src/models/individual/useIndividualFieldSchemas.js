import { useMemo } from 'react';
import { get } from 'lodash-es';

import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import {
  createFieldSchema,
  createCustomFieldSchema,
} from '../../utils/fieldUtils';
import { defaultIndividualCategories } from '../../constants/fieldCategories';

const sexChoices = [
  {
    value: 'male',
    labelId: 'MALE',
  },
  {
    value: 'female',
    labelId: 'FEMALE',
  },
  {
    value: 'non-binary',
    labelId: 'NON_BINARY',
  },
  {
    value: 'unknown',
    labelId: 'UNKNOWN',
  },
];

const statusChoices = [
  {
    value: 'alive',
    labelId: 'ALIVE',
  },
  {
    value: 'dead',
    labelId: 'DEAD',
  },
  {
    value: 'unknown',
    labelId: 'UNKNOWN',
  },
];

export default function useIndividualFieldSchemas() {
  const {
    data,
    loading,
    error,
    siteSettingsVersion,
  } = useSiteSettings();

  const individualFieldSchemas = useMemo(
    () => {
      if (loading || error) return [];

      const customFields = get(
        data,
        [
          'site.custom.customFields.MarkedIndividual',
          'value',
          'definitions',
        ],
        [],
      );
      const customFieldSchemas = customFields.map(
        createCustomFieldSchema,
      );

      return [
        createFieldSchema(fieldTypes.string, {
          name: 'defaultName',
          labelId: 'NAME',
          category: defaultIndividualCategories.general.name,
          requiredForIndividualCreation: true,
          required: true,
          defaultValue: '',
        }),
        createFieldSchema(fieldTypes.string, {
          name: 'nickname',
          labelId: 'NICKNAMES',
          category: defaultIndividualCategories.general.name,
          requiredForIndividualCreation: true,
          defaultValue: '',
        }),
        createFieldSchema(fieldTypes.select, {
          name: 'sex',
          labelId: 'SEX',
          category: defaultIndividualCategories.general.name,
          choices: sexChoices,
          requiredForIndividualCreation: true,
          defaultValue: '',
        }),
        createFieldSchema(fieldTypes.select, {
          name: 'status',
          labelId: 'STATUS',
          category: defaultIndividualCategories.general.name,
          choices: statusChoices,
          requiredForIndividualCreation: true,
          defaultValue: '',
        }),
        ...customFieldSchemas,
      ];
    },
    [siteSettingsVersion, loading, error],
  );

  return individualFieldSchemas;
}
