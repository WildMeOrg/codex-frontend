const timePrecisionMap = {
  year: {
    views: ['year'],
    intlFormat: 'yyyy',
    usFormat: 'yyyy',
    prettyFormat: 'yyyy',
  },
  month: {
    views: ['year', 'month'],
    intlFormat: 'yyyy-MM',
    usFormat: 'MM/yyyy',
    prettyFormat: 'MMMM yyyy',
  },
  day: {
    views: ['year', 'month', 'date'],
    intlFormat: 'yyyy-MM-dd',
    usFormat: 'MM/dd/yyyy',
    prettyFormat: 'PP',
  },
  time: {
    views: undefined,
    intlFormat: 'yyyy-MM-dd HH:mm',
    usFormat: 'MM/dd/yyyy hh:mm',
    prettyFormat: 'PP',
  },
};

export default timePrecisionMap;
