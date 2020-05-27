/* Where it's not obvious, I tried to leave a comment with the field value's type */
const fieldTypes = {
  string: 'string',
  longstring: 'longstring',
  float: 'float',
  feetmeters: 'feetmeters', // float represents meters, but GUI supports feet
  individual: 'individual', // string (individual ID)
  relationships: 'relationships', // { targetIndividualId: string, direction: enum, type: enum, id: int }
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
  treeeditor: 'treeeditor', // nested array
  fieldset: 'fieldset', // array of schema objects. used only in admin panel
  optioneditor: 'optioneditor', // used only in admin panel
};

/* Informaton about fields that can be turned into custom fields */
export const fieldTypeChoices = [
  { labelId: 'STRING', value: fieldTypes.string, defaultValue: '' },
  {
    labelId: 'LONG_STRING',
    value: fieldTypes.longstring,
    defaultValue: '',
  },
  { labelId: 'NUMBER', value: fieldTypes.float, defaultValue: null },
  {
    labelId: 'FEET_METERS_SELECTOR',
    value: fieldTypes.feetmeters,
    defaultValue: null,
  },
  {
    labelId: 'INDIVIDUAL_SELECTOR',
    value: fieldTypes.individual,
    defaultValue: null,
  },
  {
    labelId: 'RELATIONSHIPS_SELECTOR',
    value: fieldTypes.relationships,
    defaultValue: [],
    configuration: [
      {
        labelId: 'RELATIONSHIP_OPTIONS',
        descriptionId: 'RELATIONSHIP_OPTIONS_HELPER_TEXT',
        value: 'choices',
        type: fieldTypes.optioneditor,
        defaultValue: [],
      },
    ],
  },
  {
    labelId: 'INTEGER',
    value: fieldTypes.integer,
    defaultValue: null,
  },
  {
    labelId: 'FILE_UPLOADER',
    value: fieldTypes.file,
    defaultValue: [],
    configuration: [
      {
        labelId: 'ALLOWED_FILE_TYPES',
        descriptionId: 'FILETYPE_OPTIONS_HELPER_TEXT',
        value: 'allowedFileTypes',
        type: fieldTypes.optioneditor,
        defaultValue: [],
      },
    ],
  },
  {
    labelId: 'LAT_LONG_SELECTOR',
    value: fieldTypes.latlong,
    defaultValue: [null, null],
  },
  {
    labelId: 'DATE_PICKER',
    value: fieldTypes.date,
    defaultValue: null,
  },
  {
    labelId: 'DATE_RANGE_PICKER',
    value: fieldTypes.daterange,
    defaultValue: [null, null],
  },
  {
    labelId: 'DROPDOWN',
    value: fieldTypes.select,
    defaultValue: '',
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
  },
  {
    labelId: 'BOOLEAN',
    value: fieldTypes.boolean,
    defaultValue: null,
  },
];

export default fieldTypes;
