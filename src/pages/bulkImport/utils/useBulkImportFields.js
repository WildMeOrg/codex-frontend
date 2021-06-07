import { useMemo } from 'react';
import { useIntl } from 'react-intl';

// import fieldTypes from '../../../constants/fieldTypesNew';
import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import useSightingFieldSchemas from '../../../models/sighting/useSightingFieldSchemas';
import {
  sightingOmitList,
  encounterOmitList,
} from '../constants/bulkReportConstants';
import useOptions from './useOptions';

const floatValidator = {
  validate: 'regex_matches',
  regex: '^[+-]?((\\d+(\\.\\d*)?)|(\\.\\d+))$',
  error: 'You must enter a number',
};

// const integerValidator = {
//   validate: 'regex_matches',
//   regex: '^[-]?\\d+$',
//   error: 'You must enter a number',
// };

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

export default function useBulkImportFields() {
  const intl = useIntl();
  // const {
  //   regionOptions,
  //   speciesOptions,
  // } = useOptions;

  const sightingFieldSchemas = useSightingFieldSchemas();
  const flatfileSightingFields = useMemo(
    () => {
      if (!sightingFieldSchemas) return {};
      const bulkSightingFields = sightingFieldSchemas.filter(
        f => !sightingOmitList.includes(f.name),
      );
      return bulkSightingFields.map(f => ({
        label: f.labelId
          ? intl.formatMessage({ id: f.labelId })
          : f.label,
        key: f.name,
      }));
    },
    [sightingFieldSchemas],
  );

  const encounterFieldSchemas = useEncounterFieldSchemas();
  const flatfileEncounterFields = useMemo(
    () => {
        if (!encounterFieldSchemas) return {};
        // if (!encounterFieldSchemas || !regionOptions || !speciesOptions) return {};
        const bulkEncounterFields = encounterFieldSchemas.filter(
        f => !encounterOmitList.includes(f.name),
      );
      return bulkEncounterFields.map(f => {
        // const additionalProperties = {};
        // if (f.name === 'taxonomy') {
        //   additionalProperties.type = 'select';
        //   additionalProperties.options = speciesOptions;
        // } else if (f.name === 'species') {
        //   additionalProperties.type = 'select';
        //   additionalProperties.options = regionOptions;
        // }
        // console.log(additionalProperties);
        return {
          label: f.labelId
            ? intl.formatMessage({ id: f.labelId })
            : f.label,
          key: f.name,
          // ...additionalProperties,
        };
      });
    },
    [encounterFieldSchemas],
  );

  return [
    {
      label: intl.formatMessage({ id: 'SIGHTING_ID' }),
      key: 'sightingId',
    },
    {
      label: intl.formatMessage({ id: 'INDIVIDUAL_NAME' }),
      key: 'individualName',
    },
    {
      label: intl.formatMessage({ id: 'DECIMAL_LATITUDE' }),
      key: 'decimalLatitude',
      validators: [floatValidator],
    },
    {
      label: intl.formatMessage({ id: 'DECIMAL_LONGITUDE' }),
      key: 'decimalLongitude',
      validators: [floatValidator],
    },
    {
      label: intl.formatMessage({ id: 'ASSETS' }),
      key: 'assets',
      validators: [],
    },
    {
      label: intl.formatMessage({ id: 'TIME_YEAR' }),
      key: 'timeYear',
      validators: [positiveIntegerValidator],
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
      label: intl.formatMessage({ id: 'TIMEZONE' }),
      key: 'utcOffset',
      validators: [utcOffsetValidator],
    },
    ...flatfileEncounterFields,
    ...flatfileSightingFields,
  ];
}
