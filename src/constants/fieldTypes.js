/* Where it's not obvious, I left comments defining the variable types */

const fieldTypes = {
  string: 'string',
  longstring: 'longstring',
  float: 'float',
  integer: 'integer',
  latlong: 'latlong', // [float, float]
  daterange: 'daterange', // [date, date]
  select: 'select', // string
  multiselect: 'multiselect', // array of strings
  comparator: 'comparator', // { comparator: one of ["LT", "LTE", "GT", "GTE", "EQ"], value: float }
  boolean: 'boolean',
};

export default fieldTypes;
