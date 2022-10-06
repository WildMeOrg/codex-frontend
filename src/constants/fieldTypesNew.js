/* Where it's not obvious, I tried to leave a comment with the field value's type */
const fieldTypes = {
  string: 'string',
  longstring: 'longstring',
  float: 'float',
  integer: 'integer',
  feetmeters: 'feetmeters', // float represents meters, but GUI supports feet
  file: 'file',
  latlong: 'latlong', // [float, float] defines [lat, lng]
  date: 'date',
  daterange: 'daterange', // [date, date]
  specifiedTime: 'specifiedTime', // { time: string, timePrecision: string }
  select: 'select', // string
  multiselect: 'multiselect', // array of strings
  boolean: 'boolean',
  locationId: 'locationID', // nested array
  individual: 'individual', // string (individual ID)
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

export const fieldTypeInfo = {
  [fieldTypes.string]: {
    labelId: 'STRING',
    value: fieldTypes.string,
    backendType: backendTypes.string,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: '',
    exampleValue: 'Value appears here',
  },
  [fieldTypes.longstring]: {
    labelId: 'LONG_STRING',
    value: fieldTypes.longstring,
    backendType: backendTypes.string,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: '',
    exampleValue: 'Value appears here',
  },
  [fieldTypes.float]: {
    labelId: 'FLOAT_LABEL',
    value: fieldTypes.float,
    backendType: backendTypes.double,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: null,
    exampleValue: 12.3,
  },
  [fieldTypes.feetmeters]: {
    labelId: 'FEET_METERS_SELECTOR',
    value: fieldTypes.feetmeters,
    backendType: backendTypes.double,
    backendMultiple: false,
    canProvideDefaultValue: false,
    exampleValue: 12.3,
  },
  [fieldTypes.individual]: {
    labelId: 'INDIVIDUAL_SELECTOR',
    value: fieldTypes.individual,
    backendType: backendTypes.individual,
    backendMultiple: false,
    canProvideDefaultValue: false,
    exampleValue: null,
  },
  [fieldTypes.integer]: {
    labelId: 'INTEGER_LABEL',
    value: fieldTypes.integer,
    backendType: backendTypes.integer,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: null,
    exampleValue: 12,
  },
  [fieldTypes.latlong]: {
    labelId: 'LAT_LONG_SELECTOR',
    value: fieldTypes.latlong,
    backendType: backendTypes.geo,
    backendMultiple: false,
    canProvideDefaultValue: false,
    exampleValue: [-18.308787827355395, 68.45715332031247],
  },
  [fieldTypes.date]: {
    labelId: 'DATE_PICKER',
    value: fieldTypes.date,
    backendType: backendTypes.date,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: null,
    exampleValue: Date.now(),
  },
  [fieldTypes.daterange]: {
    labelId: 'DATE_RANGE_PICKER',
    value: fieldTypes.daterange,
    backendType: backendTypes.string,
    backendMultiple: true,
    canProvideDefaultValue: true,
    initialDefaultValue: [null, null],
    exampleValue: [Date.now(), Date.now()],
  },
  [fieldTypes.select]: {
    labelId: 'DROPDOWN',
    value: fieldTypes.select,
    backendType: backendTypes.string,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: null,
    exampleValue: 'Value appears here',
  },
  [fieldTypes.multiselect]: {
    labelId: 'MULTI_SELECT_DROPDOWN',
    value: fieldTypes.multiselect,
    backendType: backendTypes.string,
    backendMultiple: true,
    canProvideDefaultValue: true,
    initialDefaultValue: [],
    exampleValue: ['Value 1', 'Value 2'],
  },
  [fieldTypes.boolean]: {
    labelId: 'BOOLEAN',
    value: fieldTypes.boolean,
    backendType: backendTypes.boolean,
    backendMultiple: false,
    canProvideDefaultValue: true,
    initialDefaultValue: false,
    exampleValue: true,
  },
};

export default fieldTypes;
