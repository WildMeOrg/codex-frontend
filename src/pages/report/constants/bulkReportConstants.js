export const bulkImportCategories = {
  encounter: {
    name: 'encounter',
    fields: ['individualName', 'taxonomy', 'sex'],
  },
  sighting: {
    name: 'sighting',
    fields: ['sightingId'],
  },
  shared: {
    name: 'shared',
    fields: [
      'locationId',
      'verbatimLocality',
      'time',
      'decimalLatitude',
      'decimalLongitude',
    ],
  },
};

/* These fields are still used in bulk import but are ommitted from the sightings schema
   because the analogous encounter fields are used instead. */
export const sightingOmitList = [
  'locationId',
  'gps',
  'verbatimLocality',
  'startTime',
  'endTime',
];

/* Lat and lng are treated as two separate columns here */
export const encounterOmitList = ['gps'];

export const bulkFieldSchemas = [
  {
    name: 'decimalLatitude',
    labelId: 'DECIMAL_LATITUDE',
  },
  {
    name: 'decimalLongitude',
    labelId: 'DECIMAL_LONGITUDE',
  },
  {
    name: 'individualName',
    labelId: 'INDIVIDUAL_NAME',
  },
  {
    name: 'sightingId',
    labelId: 'SIGHTING_ID',
  },
];
