import fieldTypes from './fieldTypes';

export const encounterSearchCategories = {
  time: {
    name: 'time',
    labelId: 'TIME',
  },
  location: {
    name: 'location',
    labelId: 'LOCATION',
  },
  attributes: {
    name: 'attributes',
    labelId: 'ATTRIBUTES',
  },
  metadata: {
    name: 'metadata',
    labelId: 'METADATA',
  },
};

/* Excludes species, region and custom fields. These will be computed in
selectors based on site settings. */
export default [
  {
    name: 'sightingDateRange',
    labelId: 'SIGHTING_DATE_RANGE',
    descriptionId: 'SIGHTING_DATE_RANGE_DESCRIPTION',
    category: encounterSearchCategories.time.name,
    fieldType: fieldTypes.daterange,
    defaultValue: [null, null],
  },
  {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_DESCRIPTION',
    category: encounterSearchCategories.location.name,
    fieldType: fieldTypes.latlong,
    defaultValue: null,
  },
  {
    name: 'sex',
    labelId: 'SEX',
    category: encounterSearchCategories.attributes.name,
    fieldType: fieldTypes.select,
    choices: ['male', 'female', 'non-binary', 'unknown'],
    defaultValue: '',
  },
  {
    name: 'status',
    labelId: 'STATUS',
    descriptionId: 'STATUS_DESCRIPTION',
    category: encounterSearchCategories.attributes.name,
    fieldType: fieldTypes.select,
    choices: ['Alive', 'Dead', 'Unknown'],
    defaultValue: '',
  },
  {
    name: 'name_contains',
    labelId: 'NAME_CONTAINS',
    descriptionId: 'NAME_CONTAINS_DESCRIPTION',
    category: encounterSearchCategories.attributes.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'has_media',
    labelId: 'HAS_MEDIA',
    descriptionId: 'HAS_MEDIA_DESCRIPTION',
    category: encounterSearchCategories.attributes.name,
    fieldType: fieldTypes.boolean,
    defaultValue: null,
  },
  {
    name: 'encounter_status',
    labelId: 'ENCOUNTER_STATUS',
    category: encounterSearchCategories.metadata.name,
    fieldType: fieldTypes.select,
    choices: ['Approved', 'Unapproved', 'Unidentifiable'],
    defaultValue: '',
  },
  {
    name: 'submitter_name',
    labelId: 'SUBMITTER_NAME',
    descriptionId: 'SUBMITTER_NAME_DESCRIPTION',
    category: encounterSearchCategories.metadata.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
];
