import axios from 'axios';
import { partition, map } from 'lodash-es';

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

export function validateAssetStrings(
  filenames,
  assetStringInputs,
  intl,
) {
  console.log('deleteMe intl is: ');
  console.log(intl);
  const validationMessages = assetStringInputs.map(
    assetStringInput => {
      console.log('deleteMe assetStringInput is: ');
      console.log(assetStringInput);
      const [assetString, rowIndex] = assetStringInput;
      const assets = parseBulkImportString(assetString);
      console.log('deleteMe assets are: ');
      console.log(assets);
      if (assets.length === 0) return null;
      const [matchedAssets, unmatchedAssets] = partition(assets, a =>
        filenames.includes(a),
      );
      console.log('deleteMe matchedAssets are: ');
      console.log(matchedAssets);
      console.log('deleteMe unmatchedAssets are: ');
      console.log(unmatchedAssets);

      const matchedAssetsString = matchedAssets.join(', ');
      console.log('deleteMe matchedAssetsString is: ');
      console.log(matchedAssetsString);
      const unmatchedAssetsString = unmatchedAssets.join(', ');
      const matchedAssetsMessage = intl.formatMessage(
        {
          id: 'MATCHED_ASSET_MESSAGE',
        },
        { matchedAssetsString },
      );
      const unmatchedAssetsMessage = intl.formatMessage(
        {
          id: 'UNMATCHED_ASSET_MESSAGE',
        },
        { unmatchedAssetsString },
      );

      let message =
        matchedAssets.length > 0 ? matchedAssetsMessage : '';
      message = message.concat(
        unmatchedAssets.length > 0 ? unmatchedAssetsMessage : '',
      );
      console.log('deleteMe message is: ');
      console.log(message);

      const level = unmatchedAssets.length > 0 ? 'warning' : 'info';

      const rowMessage = {
        info: [
          {
            message,
            level,
          },
        ],
      };
      return [rowMessage, rowIndex];
    },
  );

  return validationMessages.filter(message => message);
}

export function validateCustomMultiSelectStrings( // TODO deleteMe somehow DRY with the above
  optionObjs,
  customMultiselectInputs,
  intl,
) {
  console.log('deleteMe entered validateCustomMultiSelectStrings');
  console.log('deleteMe optionObjs are: ');
  console.log(optionObjs);
  console.log('deleteMe customMultiselectInputs are: ');
  console.log(customMultiselectInputs);
  const options = map(optionObjs, optionObj => optionObj?.value);
  const validationMessages = customMultiselectInputs.map(
    customMultiselectInput => {
      const [optionString, rowIndex] = customMultiselectInput;
      const customOptions = parseBulkImportString(optionString);
      if (customOptions.length === 0) return null;
      const [matchedOptions, unmatchedOptions] = partition(
        customOptions,
        a => options.includes(a),
      );

      const matchedOptionsString = matchedOptions.join(', ');
      const unmatchedOptionsString = unmatchedOptions.join(', ');
      const matchedOptionMessage = intl.formatMessage(
        { id: 'MATCHED_OPTION_MESSAGE' },
        { matchedOptionsString },
      );
      const unmatchedOptionMessage = intl.formatMessage(
        {
          id: 'UNMATCHED_OPTION_MESSAGE',
        },
        { unmatchedOptionsString },
      );

      let message =
        matchedOptions.length > 0 ? matchedOptionMessage : '';
      message = message.concat(
        unmatchedOptions.length > 0 ? unmatchedOptionMessage : '',
      );

      const level = unmatchedOptions.length > 0 ? 'warning' : 'info';

      const rowMessage = {
        info: [
          {
            message,
            level,
          },
        ],
      };
      return [rowMessage, rowIndex];
    },
  );

  return validationMessages.filter(message => message);
}
