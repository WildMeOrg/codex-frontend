import fieldTypes from './fieldTypes';

export const sightingCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
    individualFields: false,
  },
  location: {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_CATEGORY_DESCRIPTION',
    required: true,
    individualFields: false,
  },
  sightingDetails: {
    name: 'sightingDetails',
    labelId: 'SIGHTING_DETAILS',
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
    name: 'region',
    labelId: 'REGION',
    category: sightingCategories.location.name,
    fieldType: fieldTypes.treeview,
    multiselect: false,
    choices: [],
    defaultValue: [],
  },
  {
    name: 'location',
    labelId: 'EXACT_LOCATION',
    descriptionId: 'LOCATION_DESCRIPTION',
    category: sightingCategories.location.name,
    fieldType: fieldTypes.latlong,
    defaultValue: [null, null],
  },
  {
    name: 'location_freeform',
    labelId: 'LOCATION_FREEFORM',
    descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
    category: sightingCategories.location.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'sightingDate',
    labelId: 'SIGHTING_DATE',
    category: sightingCategories.general.name,
    fieldType: fieldTypes.date,
    required: true,
    defaultValue: null,
  },
  {
    name: 'sightingContext',
    labelId: 'SIGHTING_CONTEXT',
    category: sightingCategories.general.name,
    fieldType: fieldTypes.select,
    required: true,
    choices: [
      {
        value: 'research-effort',
        labelId: 'RESEARCH_EFFORT',
      },
      {
        value: 'wildlife-tour',
        labelId: 'WILDLIFE_TOUR',
      },
      {
        value: 'opportunistic-sighting',
        labelId: 'OPPORTUNISTIC_SIGHTING',
      },
    ],
    defaultValue: '',
  },
  {
    name: 'sex',
    labelId: 'SEX',
    category: sightingCategories.animal.name,
    fieldType: fieldTypes.select,
    choices: [
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
    ],
    defaultValue: '',
  },
  {
    name: 'status',
    labelId: 'STATUS',
    descriptionId: 'STATUS_SIGHTING_DESCRIPTION',
    category: sightingCategories.animal.name,
    fieldType: fieldTypes.select,
    choices: [
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
    ],
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
    category: sightingCategories.sightingDetails.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'photographerEmail',
    labelId: 'PHOTOGRAPHER_EMAIL',
    category: sightingCategories.sightingDetails.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
];
