export const bulkImportCategories = {
  encounter: {
    name: 'animal',
    fields: ['firstName', 'taxonomy', 'sex'],
  },
  sighting: {
    name: 'sighting',
    fields: [
      'sightingId',
      'assetReferences',
      'locationId',
      'comments',
    ],
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
  'gps',
  'verbatimLocality',
  'specifiedTime',
];

/* Lat and lng are treated as two separate columns here */
export const encounterOmitList = ['gps', 'specifiedTime'];

export function deriveCustomFieldPrefix(categoryType) {
  return `custom-${categoryType}-`;
}
