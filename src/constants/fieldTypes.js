/* Where it's not obvious, I tried to leave a comment with the field value's type */
const fieldTypes = {
  string: 'string',
  longstring: 'longstring',
  password: 'password',
  float: 'float',
  feetmeters: 'feetmeters', // float represents meters, but GUI supports feet
  individual: 'individual', // string (individual ID)
  integer: 'integer',
  file: 'file',
  latlong: 'latlong', // [float, float] defines [lat, lng]
  area: 'area', // { north: float, east: float, south: float, west: float } defines a geographic bounding box
  date: 'date',
  daterange: 'daterange', // [date, date]
  select: 'select', // string
  multiselect: 'multiselect', // array of strings
  comparator: 'comparator', // { comparator: one of ["LT", "LTE", "GT", "GTE", "EQ"], value: float }
  boolean: 'boolean',
  treeview: 'treeview', // nested array
  treeeditor: 'treeeditor', // nested array (deprecated, replaced by locationIds)
  locationIds: 'locationIds',
  color: 'color', // used only in admin panel
  optioneditor: 'optioneditor', // used only in admin panel
  filetypeeditor: 'filetypeeditor', // used only in admin panel
  categorylist: 'categoryList', // used only in admin panel
  projectId: 'projectId', // used only in admin panel
};

const backendTypes = {
  string: 'string',
  integer: 'integer',
  double: 'double',
  long: 'long',
  date: 'date',
  boolean: 'boolean',
  url: 'url',
  uuid: 'uuid',
  image: 'image',
  video: 'video',
  color: 'color',
  geo: 'geo',
  json: 'json',
  individual: 'individual',
  encounter: 'encounter',
  customFields: 'customFields',
  locationIds: 'locationIds',
  taxonomy: 'taxonomy',
};

/* Information about fields that can be turned into custom fields */
export const fieldTypeChoices = [
  {
    labelId: 'STRING',
    value: fieldTypes.string,
    defaultValue: '',
    backendType: backendTypes.string,
    backendMultiple: false,
  },
  {
    labelId: 'LONG_STRING',
    value: fieldTypes.longstring,
    defaultValue: '',
    backendType: backendTypes.string,
    backendMultiple: false,
  },
  {
    labelId: 'FLOAT_LABEL',
    value: fieldTypes.float,
    defaultValue: null,
    backendType: backendTypes.double,
    backendMultiple: false,
  },
  {
    labelId: 'FEET_METERS_SELECTOR',
    value: fieldTypes.feetmeters,
    defaultValue: null,
    backendType: backendTypes.double,
    backendMultiple: false,
  },
  {
    labelId: 'INDIVIDUAL_SELECTOR',
    value: fieldTypes.individual,
    defaultValue: null,
    backendType: backendTypes.individual,
    backendMultiple: false,
  },
  {
    labelId: 'INTEGER_LABEL',
    value: fieldTypes.integer,
    defaultValue: null,
    backendType: backendTypes.integer,
    backendMultiple: false,
  },
  {
    labelId: 'FILE_UPLOADER',
    value: fieldTypes.file,
    defaultValue: null,
    backendType: backendTypes.string,
    backendMultiple: false,
    configuration: [
      {
        labelId: 'ALLOWED_FILE_TYPES',
        descriptionId: 'FILETYPE_OPTIONS_HELPER_TEXT',
        value: 'allowedFileTypes',
        type: fieldTypes.filetypeeditor,
        defaultValue: [],
      },
      {
        labelId: 'DARK_BACKGROUND',
        descriptionId: 'DARK_BACKGROUND_HELPER_TEXT',
        value: 'dark',
        type: fieldTypes.boolean,
        defaultValue: false,
      },
    ],
  },
  {
    labelId: 'LAT_LONG_SELECTOR',
    value: fieldTypes.latlong,
    defaultValue: [null, null],
    backendType: backendTypes.geo,
    backendMultiple: false,
  },
  {
    labelId: 'DATE_PICKER',
    value: fieldTypes.date,
    defaultValue: null,
    backendType: backendTypes.date,
    backendMultiple: false,
  },
  {
    labelId: 'DATE_RANGE_PICKER',
    value: fieldTypes.daterange,
    defaultValue: [null, null],
    backendType: backendTypes.string,
    backendMultiple: true,
  },
  {
    labelId: 'DROPDOWN',
    value: fieldTypes.select,
    defaultValue: null,
    backendType: backendTypes.string,
    backendMultiple: false,
    configuration: [
      {
        labelId: 'DROPDOWN_OPTIONS',
        descriptionId: 'DROPDOWN_CHOICE_HELPER_TEXT',
        value: 'choices',
        type: fieldTypes.optioneditor,
        defaultValue: [],
      },
    ],
  },
  {
    labelId: 'MULTI_SELECT_DROPDOWN',
    value: fieldTypes.multiselect,
    defaultValue: [],
    backendType: backendTypes.string,
    backendMultiple: true,
    configuration: [
      {
        labelId: 'DROPDOWN_OPTIONS',
        descriptionId: 'DROPDOWN_CHOICE_HELPER_TEXT',
        value: 'choices',
        type: fieldTypes.optioneditor,
        defaultValue: [],
      },
    ],
  },
  {
    labelId: 'COMPARATOR',
    value: fieldTypes.comparator,
    defaultValue: { comparator: '', value: '' },
    backendType: backendTypes.json,
    backendMultiple: false,
  },
  {
    labelId: 'BOOLEAN',
    value: fieldTypes.boolean,
    defaultValue: null,
    backendType: backendTypes.boolean,
    backendMultiple: false,
  },
];

export const customFieldCategories = [
  {
    labelId: 'BASIC_INPUTS',
    fields: [
      fieldTypes.boolean,
      fieldTypes.date,
      fieldTypes.string,
      fieldTypes.longstring,
      fieldTypes.float,
      fieldTypes.integer,
    ],
  },
  {
    labelId: 'SPECIAL_INPUTS',
    fields: [
      fieldTypes.daterange,
      fieldTypes.select,
      fieldTypes.multiselect,
      fieldTypes.file,
      fieldTypes.individual,
      fieldTypes.latlong,
      fieldTypes.feetmeters,
    ],
  },
];

export default fieldTypes;
