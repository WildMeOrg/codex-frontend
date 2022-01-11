const timePrecisionMap = {
  year: {
    views: ['year'],
    intlFormat: 'yyyy',
    usFormat: 'yyyy',
  },
  month: {
    views: ['year', 'month'],
    intlFormat: 'yyyy-MM',
    usFormat: 'MM/yyyy',
  },
  day: {
    views: ['year', 'month', 'date'],
    intlFormat: 'yyyy-MM-dd',
    usFormat: 'MM/dd/yyyy',
  },
  time: {
    views: undefined,
    intlFormat: 'yyyy-MM-dd HH:mm',
    usFormat: 'MM/dd/yyyy hh:mm',
  },
};

export default timePrecisionMap;
