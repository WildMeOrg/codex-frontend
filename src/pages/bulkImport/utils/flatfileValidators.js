import axios from 'axios';
import { partition } from 'lodash-es';

import parseBulkImportString from './parseBulkImportString';

export async function validateIndividualNames(names) {
  const response = await axios.request({
    method: 'post',
    url: `${__houston_url__}/api/v1/individuals/validate`,
    data: names,
  });
  return response?.data || [];
}

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

export function validateMinMax(record) {
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

export function validateStrings(
  validEntries,
  stringInputs,
  matchedMessage,
  unMatchedMessage,
  intl,
) {
  const validationMessages = stringInputs.map(stringInput => {
    const [str, rowIndex] = stringInput;
    const strs = parseBulkImportString(str);
    if (strs.length === 0) return null;
    const [matchedStrs, unmatchedStrs] = partition(strs, a =>
      validEntries.includes(a),
    );
    const matchedString = matchedStrs.join(', ');
    const unmatchedString = unmatchedStrs.join(', ');
    const completeMatchedMessage = intl.formatMessage(
      { id: matchedMessage },
      { results: matchedString },
    );
    const completeUnmatchedMessage = intl.formatMessage(
      {
        id: unMatchedMessage,
      },
      { results: unmatchedString },
    );

    let message =
      matchedStrs.length > 0 ? completeMatchedMessage : '';
    message = message.concat(
      unmatchedStrs.length > 0 ? completeUnmatchedMessage : '',
    );

    const level = unmatchedStrs.length > 0 ? 'warning' : 'info';

    const rowMessage = {
      info: [
        {
          message,
          level,
        },
      ],
    };
    return [rowMessage, rowIndex];
  });
  return validationMessages.filter(message => message);
}
