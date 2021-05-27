import { useMemo } from 'react';
import { useIntl } from 'react-intl';

// import fieldTypes from '../../../constants/fieldTypesNew';
import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import useSightingFieldSchemas from '../../../models/sighting/useSightingFieldSchemas';

/* These fields are still used in bulk import but are ommitted from the sightings schema
   because the analogous encounter fields are used instead. */
const sightingOmitList = [
  'locationId',
  'gps',
  'verbatimLocality',
  'startTime',
  'endTime',
];

/* Lat and lng are treated as two separate columns here */
const encounterOmitList = ['gps'];

const floatValidator = {
  validate: 'regex_matches',
  regex: '^[+-]?((\\d+(\\.\\d*)?)|(\\.\\d+))$',
  error: 'You must enter a number',
};

export default function useBulkImportFields() {
  const intl = useIntl();

  const sightingFieldSchemas = useSightingFieldSchemas();
  const flatfileSightingFields = useMemo(
    () => {
      if (!sightingFieldSchemas) return null;
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
      if (!encounterFieldSchemas) return null;
      const bulkEncounterFields = encounterFieldSchemas.filter(
        f => !encounterOmitList.includes(f.name),
      );
      return bulkEncounterFields.map(f => ({
        label: f.labelId
          ? intl.formatMessage({ id: f.labelId })
          : f.label,
        key: f.name,
      }));
    },
    [encounterFieldSchemas],
  );

  return [
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
    ...flatfileEncounterFields,
    {
      label: intl.formatMessage({ id: 'SIGHTING_ID' }),
      key: 'sightingId',
    },
    ...flatfileSightingFields,
  ];
}

// [
//   { label: 'Filename', key: 'filename' },
//   { label: 'Species', key: 'species' },
//   { label: 'Region', key: 'region' },
//   { label: 'Latitude', key: 'lat' },
//   { label: 'Longitude', key: 'long' },
//   { label: 'Sex', key: 'sex' },
//   { label: 'Status', key: 'status' },
//   { label: 'Photographer', key: 'photographer' },
//   {
//     label: 'Photographer email',
//     key: 'photographer_email',
//   },
// ]
