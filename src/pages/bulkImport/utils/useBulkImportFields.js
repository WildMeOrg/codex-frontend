import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { omitBy, map, filter } from 'lodash-es';

import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import useSightingFieldSchemas from '../../../models/sighting/useSightingFieldSchemas';
import {
  sightingOmitList,
  encounterOmitList,
  deriveCustomFieldPrefix,
} from '../constants/bulkReportConstants';
import categoryTypes from '../../../constants/categoryTypes';
import timePrecisionMap from '../../../constants/timePrecisionMap';
import useOptions from '../../../hooks/useOptions';
import sexOptions from '../../../constants/sexOptions';
import { formatDuplicateLabel } from './bulkImportFormatters';

const requiredValidator = {
  validate: 'required',
};

const floatValidator = {
  validate: 'regex_matches',
  regex: '^[+-]?((\\d+(\\.\\d*)?)|(\\.\\d+))$',
  error: 'You must enter a number',
};

const positiveIntegerValidator = {
  validate: 'regex_matches',
  regex: '^\\d+$',
  error: 'You must enter a number',
};

const utcOffsetValidator = {
  validate: 'regex_matches',
  regex: '^[\\+-]?\\d?\\d:\\d\\d$',
  error: 'Not a valid timezone (UTC offset format)',
};

function deriveLabel(field, intl) {
  const label = field?.labelId
    ? intl.formatMessage({
        id: field.labelId,
      })
    : field?.label;
  return label || 'Label unavailable';
}

function deriveKey(field, categoryType) {
  if (!field.customField) return field.name;

  const prefix = deriveCustomFieldPrefix(categoryType);
  return prefix + field.id;
}

export default function useBulkImportFields() {
  const intl = useIntl();
  const { regionOptions, speciesOptions } = useOptions();
  const sightingFieldSchemas = useSightingFieldSchemas();
  const flatfileSightingFields = useMemo(() => {
    if (!sightingFieldSchemas) return {};
    const bulkSightingFields = sightingFieldSchemas.filter(
      f => !sightingOmitList.includes(f.name),
    );
    return bulkSightingFields.map(f => {
      const additionalProperties = {};
      if (
        f?.fieldType === 'select' ||
        f?.fieldType === 'multiselect'
      ) {
        additionalProperties.type = 'select';
      }
      if (f?.choices) additionalProperties.options = f.choices;
      if (f.name === 'locationId') {
        additionalProperties.type = 'select';
        additionalProperties.options = regionOptions;
        additionalProperties.validators = [requiredValidator];
      }
      return {
        label: deriveLabel(f, intl),
        key: deriveKey(f, categoryTypes.sighting),
        ...additionalProperties,
      };
    });
  }, [intl, sightingFieldSchemas, regionOptions]);

  const encounterFieldSchemas = useEncounterFieldSchemas();
  
  const flatfileEncounterFields = useMemo(() => {
    if (!encounterFieldSchemas || !regionOptions || !speciesOptions)
      return {};
    const bulkEncounterFields = encounterFieldSchemas.filter(
      f => !encounterOmitList.includes(f.name),
    );
    return bulkEncounterFields.map(f => {
      const additionalProperties = {};
      if (
        f?.fieldType === 'select' ||
        f?.fieldType === 'multiselect'
      ) {
        additionalProperties.type = 'select';
      }
      if (f?.choices) additionalProperties.options = f.choices;
      if (f.name === 'taxonomy') {
        additionalProperties.type = 'select';
        additionalProperties.options = speciesOptions;
      }
      if (f.name === 'sex') {
        const sanitizedSexOptions = Object.values(
          omitBy(sexOptions, sex => sex?.labelId === 'BLANK'),
        );
        additionalProperties.type = 'select';
        additionalProperties.options = sanitizedSexOptions;
      }
      return {
        label: deriveLabel(f, intl),
        key: deriveKey(f, categoryTypes.encounter),
        ...additionalProperties,
      };
    });
  }, [intl, encounterFieldSchemas, speciesOptions]);

  const additionalFlatfileFields = [
    {
      label: intl.formatMessage({
        id: 'SIGHTING_ID',
      }),
      key: 'sightingId',
    },
    {
      label: intl.formatMessage({
        id: 'INDIVIDUAL_NAME',
      }),
      key: 'firstName',
    },
    {
      label: intl.formatMessage({
        id: 'DECIMAL_LATITUDE',
      }),
      key: 'decimalLatitude',
      validators: [
        floatValidator,
        { validate: 'required_with', fields: ['decimalLongitude'] },
      ],
    },
    {
      label: intl.formatMessage({ id: 'DECIMAL_LONGITUDE' }),
      key: 'decimalLongitude',
      validators: [
        floatValidator,
        { validate: 'required_with', fields: ['decimalLatitude'] },
      ],
    },
    {
      label: intl.formatMessage({ id: 'ASSETS' }),
      key: 'assetReferences',
      validators: [],
    },
    {
      label: intl.formatMessage({ id: 'TIME_YEAR' }),
      key: 'timeYear',
      validators: [requiredValidator, positiveIntegerValidator],
    },
    {
      label: intl.formatMessage({ id: 'TIME_MONTH' }),
      key: 'timeMonth',
      validators: [positiveIntegerValidator],
    },
    {
      label: intl.formatMessage({ id: 'TIME_DAY' }),
      key: 'timeDay',
      validators: [positiveIntegerValidator],
    },
    {
      label: intl.formatMessage({ id: 'TIME_HOUR' }),
      key: 'timeHour',
      validators: [positiveIntegerValidator],
    },
    {
      label: intl.formatMessage({ id: 'TIME_MINUTES' }),
      key: 'timeMinutes',
      validators: [positiveIntegerValidator],
    },
    {
      label: intl.formatMessage({ id: 'TIME_SECONDS' }),
      key: 'timeSeconds',
      validators: [positiveIntegerValidator],
    },
    {
      label: intl.formatMessage({ id: 'SIGHTING_TIME_SPECIFICITY' }),
      key: 'timeSpecificity',
      validators: [requiredValidator],
      type: 'select',
      options: Object.keys(timePrecisionMap).map(t => ({
        label: t,
        value: t,
      })),
    },
    {
      label: intl.formatMessage({
        id: 'TIMEZONE',
      }),
      key: 'utcOffset',
      validators: [utcOffsetValidator],
    },
  ];

  const allAvailableFields = [
    ...additionalFlatfileFields,
    ...flatfileEncounterFields,
    ...flatfileSightingFields,
  ];
  const allLabels = map(
    allAvailableFields,
    field => field?.label,
    [],
  );
  const duplicates = filter(
    allAvailableFields,
    (field, idx) => allLabels.indexOf(field?.label) !== idx,
  );
  const duplicateLabels = map(
    duplicates,
    duplicate => duplicate?.label,
  );
  const disambiguatedAvailableFields = map(
    allAvailableFields,
    availableField =>
      duplicateLabels.includes(availableField?.label)
        ? {
            ...availableField,
            label: formatDuplicateLabel(
              availableField?.label,
              availableField?.key,
              intl,
            ),
          }
        : availableField,
  );

  return {
    numEncounterFieldsForFlatFile: flatfileEncounterFields.length,
    numSightingFieldsForFlatFile: flatfileSightingFields.length,
    availableFields: disambiguatedAvailableFields,
  };
}
