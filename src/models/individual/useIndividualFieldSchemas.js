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
          choices: sexOptions,
          requiredForIndividualCreation: true,
          defaultValue: null,
        }),
        ...customFieldSchemas,
      ];
    },
    [siteSettingsVersion, loading, error],
  );

  return individualFieldSchemas;
}
