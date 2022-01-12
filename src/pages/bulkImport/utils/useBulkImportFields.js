import { useMemo } from 'react';
import { useIntl } from 'react-intl';

// import fieldTypes from '../../../constants/fieldTypesNew';
import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import useSightingFieldSchemas from '../../../models/sighting/useSightingFieldSchemas';
import {
  sightingOmitList,
  encounterOmitList,
} from '../constants/bulkReportConstants';
import useOptions from '../../../hooks/useOptions';

const requiredValidator = {
  validate: 'required',
};

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
  const { regionOptions, speciesOptions } = useOptions();
  // console.log('deleteMe regionOptions is: ');
  // console.log(regionOptions);

  const sightingFieldSchemas = useSightingFieldSchemas();

  const flatfileSightingFields = useMemo(
    () => {
      // console.log('deleteMe got here x0');
      if (!sightingFieldSchemas) return {};
      // console.log('deleteMe got here x1');
      const bulkSightingFields = sightingFieldSchemas.filter(
        f => !sightingOmitList.includes(f.name),
      );
      // console.log('deleteMe got here x2');
      // console.log('deleteMe bulkSightingFields is: ');
      // console.log(bulkSightingFields);
      return bulkSightingFields.map(f => {
        // console.log('deleteMe got here x3 and f is: ');
        // console.log(f);
        const additionalProperties = {};
        if (f.name === 'locationId') {
          additionalProperties.type = 'select';
          additionalProperties.options = regionOptions;
          // console.log('deleteMe x4 additionalProperties are: ');
          // console.log(additionalProperties);
          // debugger; //deleteMe
          additionalProperties.validators = [
            {
              validate: 'required_without_all',
              fields: [
                'decimalLatitude',
                'decimalLongitude',
                'verbatimLocality',
              ],
              error: 'At least one location field is required.',
            },
          ];
        }
        // const returnObj = {
        //   label: f.labelId
        //     ? intl.formatMessage({
        //         id: f.labelId,
        //       })
        //     : f.label,
        //   key: f.name,
        //   ...additionalProperties,
        // };
        // console.log('deleteMe returnObj is: ');
        // console.log(returnObj);
        return {
          label: f.labelId
            ? intl.formatMessage({
                id: f.labelId,
              })
            : f.label,
          key: f.name,
          ...additionalProperties,
        };
      });
    },
    [sightingFieldSchemas, regionOptions],
  );
  // console.log('deleteMe got here a2 flatfileSightingFields is: ');
  // console.log(flatfileSightingFields);

  const encounterFieldSchemas = useEncounterFieldSchemas();
  // console.log('deleteMe encounterFieldSchemas are: ');
  // console.log(encounterFieldSchemas);
  const flatfileEncounterFields = useMemo(
    () => {
      if (!encounterFieldSchemas || !regionOptions || !speciesOptions)
        return {};
      const bulkEncounterFields = encounterFieldSchemas.filter(
        f => !encounterOmitList.includes(f.name),
      );
      return bulkEncounterFields.map(f => {
        const additionalProperties = {};
        if (f.name === 'taxonomy') {
          additionalProperties.type = 'select';
          additionalProperties.options = speciesOptions;
          // console.log(
          //   'deleteMe additionalProperties for species are: ',
          // );
          // console.log(additionalProperties);
          // debugger; // deleteMe
        }
        // else if (f.name === 'locationId') {
        //   additionalProperties.type = 'select';
        //   additionalProperties.options = regionOptions;
        //   additionalProperties.validators = [
        //     {
        //       validate: 'required_without_all',
        //       fields: [
        //         'decimalLatitude',
        //         'decimalLongitude',
        //         'verbatimLocality',
        //       ],
        //       error: 'At least one location field is required.',
        //     },
        //   ];
        // }

        return {
          label: f.labelId
            ? intl.formatMessage({ id: f.labelId })
            : f.label,
          key: f.name,
          ...additionalProperties,
        };
      });
    },
    [encounterFieldSchemas, speciesOptions],
  );
  const additionalFields = [
    // TODO I don't know what to call these yet
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
      key: 'individualName',
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
    },
    {
      label: intl.formatMessage(
        // TODO string validator
        { id: 'TIMEZONE' },
      ),
      key: 'utcOffset',
      validators: [utcOffsetValidator],
    },
  ];

  return {
    numEncounterFieldsForFlatFile: flatfileEncounterFields.length,
    numSightingFieldsForFlatFile: flatfileSightingFields.length,
    availableFields: [
      ...additionalFields,
      ...flatfileEncounterFields,
      ...flatfileSightingFields,
    ],
  };
}
