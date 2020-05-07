import fieldTypes from './fieldTypes';

export const sightingCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
    individualFields: false,
  },
  encounterDetails: {
    name: 'encounterDetails',
    labelId: 'ENCOUNTER_DETAILS',
    individualFields: false,
  },
  animal: {
    name: 'animal',
    labelId: 'ANIMAL_INFORMATION',
    individualFields: true,
  },
};

/* Excludes species, region and custom fields. These will be computed in
selectors based on site settings. */
export default [
  {
    name: 'sightingDate',
    labelId: 'SIGHTING_DATE',
    category: sightingCategories.general.name,
    fieldType: fieldTypes.date,
    required: true,
    defaultValue: null,
  },
  {
    name: 'encounterContext',
    labelId: 'ENCOUNTER_CONTEXT',
    category: sightingCategories.general.name,
    fieldType: fieldTypes.select,
    required: true,
    choices: [
      'Research effort',
      'Wildlife tour',
      'Opportunistic sighting',
    ],
    defaultValue: '',
  },
  {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_DESCRIPTION',
    category: sightingCategories.general.name,
    fieldType: fieldTypes.latlong,
    defaultValue: null,
  },
  {
    name: 'location_freeform',
    labelId: 'LOCATION_FREEFORM',
    descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
    category: sightingCategories.general.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'sex',
    labelId: 'SEX',
    category: sightingCategories.animal.name,
    fieldType: fieldTypes.select,
    choices: ['male', 'female', 'non-binary', 'unknown'],
    defaultValue: '',
  },
  {
    name: 'status',
    labelId: 'STATUS',
    descriptionId: 'STATUS_ENCOUNTERS_DESCRIPTION',
    category: sightingCategories.animal.name,
    fieldType: fieldTypes.select,
    choices: ['Alive', 'Dead', 'Unknown'],
    defaultValue: '',
  },
  {
    name: 'autoMatch',
    labelId: 'AUTO_MATCH',
    descriptionId: 'AUTO_MATCH_DESCRIPTION',
    category: sightingCategories.animal.name,
    fieldType: fieldTypes.individual,
    defaultValue: null,
  },
  {
    name: 'photographer',
    labelId: 'PHOTOGRAPHER',
    descriptionId: 'PHOTOGRAPHER_DESCRIPTION',
    category: sightingCategories.encounterDetails.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'photographerEmail',
    labelId: 'PHOTOGRAPHER_EMAIL',
    category: sightingCategories.encounterDetails.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
];
