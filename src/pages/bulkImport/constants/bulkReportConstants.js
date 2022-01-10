export const bulkImportCategories = {
  encounter: {
    name: 'encounter',
    fields: ['individualName', 'taxonomy', 'sex'],
  },
  sighting: {
    name: 'sighting',
    fields: ['sightingId', 'assets', 'locationId'],
  },
  shared: {
    name: 'shared',
    fields: [
      'timeYear',
      'timeMonth',
      'timeDay',
      'timeHour',
      'timeMinutes',
      'timeSeconds',
      'timeSpecificity',
      'utcOffset',
      'verbatimLocality',
      'decimalLatitude',
      'decimalLongitude',
    ],
  },
};

/* These fields are still used in bulk import but are ommitted from the sightings schema
   because the analogous encounter fields are used instead. */
export const sightingOmitList = [
  // 'locationId',
  'gps',
  'verbatimLocality',
  'time',
  'timeSpecificity',
];

/* Lat and lng are treated as two separate columns here */
export const encounterOmitList = ['gps', 'time', 'timeSpecificity'];

export const bulkFieldSchemas = [
  { name: 'decimalLatitude', labelId: 'DECIMAL_LATITUDE' },
  { name: 'decimalLongitude', labelId: 'DECIMAL_LONGITUDE' },
  { name: 'individualName', labelId: 'INDIVIDUAL_NAME' },
  { name: 'locationId', labelId: 'REGION' },
  { name: 'timeSpecificity', labelId: 'SIGHTING_TIME_SPECIFICITY' },
  { name: 'sightingId', labelId: 'SIGHTING_ID' },
  { name: 'timeYear', labelId: 'TIME_YEAR' },
  { name: 'timeMonth', labelId: 'TIME_MONTH' },
  { name: 'timeDay', labelId: 'TIME_DAY' },
  { name: 'timeHour', labelId: 'TIME_HOUR' },
  { name: 'timeMinutes', labelId: 'TIME_MINUTES' },
  { name: 'timeSeconds', labelId: 'TIME_SECONDS' },
  { name: 'utcOffset', labelId: 'TIMEZONE' },
  { name: 'assets', labelId: 'ASSETS' },
];
