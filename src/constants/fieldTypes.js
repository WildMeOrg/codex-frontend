/* Where it's not obvious, I left comments defining the variable types */

const fieldTypes = {
  string: 'string',
  longstring: 'longstring',
  float: 'float',
  feetmeters: 'feetmeters', // float represents meters, but GUI supports feet
  integer: 'integer',
  file: 'file',
  latlong: 'latlong', // [float, float]
  date: 'date',
  daterange: 'daterange', // [date, date]
  select: 'select', // string
  multiselect: 'multiselect', // array of strings
  comparator: 'comparator', // { comparator: one of ["LT", "LTE", "GT", "GTE", "EQ"], value: float }
  boolean: 'boolean',
};

export default fieldTypes;
