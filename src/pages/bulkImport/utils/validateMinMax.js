const minmax = {
  decimalLatitude: [-180, 180],
  decimalLongitude: [-180, 180],
  timeYear: [1900, 2099],
  timeMonth: [1, 12],
  timeDay: [1, 31],
  timeHour: [0, 23],
  timeMinutes: [0, 59],
  timeSeconds: [0, 59],
};
const minmaxKeys = Object.keys(minmax);

export default function validateMinMax(record) {
  const recordHookResponse = {};
  minmaxKeys.forEach(key => {
    if (record[key]) {
      const value = parseFloat(record[key]);
      const min = minmax[key][0];
      const max = minmax[key][1];
      if (value < min || value > max) {
        recordHookResponse[key] = {
          info: [
            {
              message: `Value must be between ${min} and ${max}`,
              level: 'error',
            },
          ],
        };
      }
    }
  });
  return recordHookResponse;
}
