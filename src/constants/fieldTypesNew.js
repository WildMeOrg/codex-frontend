/* Where it's not obvious, I tried to leave a comment with the field value's type */
const fieldTypes = {
  string: 'string',
  longstring: 'longstring',
  float: 'float',
  integer: 'integer',
  feetmeters: 'feetmeters', // float represents meters, but GUI supports feet
  file: 'file',
  latlong: 'latlong', // [float, float] defines [lat, lng]
  area: 'area', // { north: float, east: float, south: float, west: float } defines a geographic bounding box
  date: 'date',
  daterange: 'daterange', // [date, date]
  select: 'select', // string
  multiselect: 'multiselect', // array of strings
  boolean: 'boolean',
  locationID: 'locationID', // nested array
  individual: 'individual', // string (individual ID)
  relationships: 'relationships', // { targetIndividualId: string, direction: enum, type: enum, id: int }
};

export default fieldTypes;
