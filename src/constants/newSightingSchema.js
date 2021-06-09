import fieldTypes from './fieldTypes';

const categoryIds = {
  general: 'general',
  location: 'location',
  details: 'details',
};

export const defaultSightingCategories = [
  {
    id: categoryIds.general,
    label: 'General',
  },
  {
    id: categoryIds.location,
    label: 'Location',
  },
  {
    id: categoryIds.details,
    label: 'Sighting Details',
  },
];

export const defaultSightingFields = [
  {
    name: 'sightingDate',
    labelId: 'SIGHTING_DATE',
    category: categoryIds.general,
    fieldType: fieldTypes.date,
    required: true,
    defaultValue: null,
  },
  {
    name: 'region',
    labelId: 'REGION',
    category: categoryIds.location,
    fieldType: fieldTypes.treeview,
    multiselect: false,
    choices: [],
    defaultValue: [],
  },
  {
    name: 'location',
    labelId: 'EXACT_LOCATION',
    descriptionId: 'LOCATION_DESCRIPTION',
    category: categoryIds.location,
    fieldType: fieldTypes.latlong,
    defaultValue: [null, null],
  },
  {
    name: 'location_freeform',
    labelId: 'LOCATION_FREEFORM',
    descriptionId: 'LOCATION_FREEFORM_DESCRIPTION',
    category: categoryIds.location,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'photographer',
    labelId: 'PHOTOGRAPHER',
    descriptionId: 'PHOTOGRAPHER_DESCRIPTION',
    category: categoryIds.details,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'photographerEmail',
    labelId: 'PHOTOGRAPHER_EMAIL',
    category: categoryIds.details,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
];
