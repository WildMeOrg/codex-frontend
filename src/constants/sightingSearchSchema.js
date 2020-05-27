import fieldTypes from './fieldTypes';

export const sightingSearchCategories = {
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
    category: sightingSearchCategories.time.name,
    fieldType: fieldTypes.daterange,
    defaultValue: [null, null],
  },
  {
    name: 'region',
    labelId: 'REGION',
    category: sightingSearchCategories.location.name,
    fieldType: fieldTypes.treeview,
    required: true,
    multiselect: true,
    choices: [],
    defaultValue: [],
  },
  {
    name: 'location',
    labelId: 'BOUNDING_BOX',
    descriptionId: 'BOUNDING_BOX_DESCRIPTION',
    category: sightingSearchCategories.location.name,
    fieldType: fieldTypes.area,
    defaultValue: null,
  },
  {
    name: 'sex',
    labelId: 'SEX',
    category: sightingSearchCategories.attributes.name,
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
    category: sightingSearchCategories.attributes.name,
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
    name: 'name_contains',
    labelId: 'NAME_CONTAINS',
    descriptionId: 'NAME_CONTAINS_DESCRIPTION',
    category: sightingSearchCategories.attributes.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
  {
    name: 'has_media',
    labelId: 'HAS_MEDIA',
    descriptionId: 'HAS_MEDIA_ENCOUNTERS_DESCRIPTION',
    category: sightingSearchCategories.attributes.name,
    fieldType: fieldTypes.boolean,
    defaultValue: null,
  },
  {
    name: 'sighting_status',
    labelId: 'SIGHTING_STATUS',
    category: sightingSearchCategories.metadata.name,
    fieldType: fieldTypes.select,
    choices: [
      {
        value: 'approved',
        labelId: 'APPROVED',
      },
      {
        value: 'unapproved',
        labelId: 'UNAPPROVED',
      },
      {
        value: 'unidentifiable',
        labelId: 'UNIDENTIFIABLE',
      },
    ],
    defaultValue: '',
  },
  {
    name: 'submitter_name',
    labelId: 'SUBMITTER_NAME',
    descriptionId: 'SUBMITTER_NAME_DESCRIPTION',
    category: sightingSearchCategories.metadata.name,
    fieldType: fieldTypes.string,
    defaultValue: '',
  },
];
