import {
  get,
  filter,
  reduce,
  map,
  keyBy,
  mapValues,
} from 'lodash-es';

import { validateStrings } from './flatfileValidators';

export const formatDuplicateLabel = (currentLabel, key, intl) => {
  let returnLabel = currentLabel;
  if (key.startsWith('custom-sighting'))
    returnLabel = intl.formatMessage(
      {
        id: 'SIGHTINGS_LABEL',
      },
      { label: currentLabel },
    );
  else if (key.startsWith('custom-encounter'))
    returnLabel = intl.formatMessage(
      { id: 'ENCOUTNER_LABEL' },
      { label: currentLabel },
    );
  return returnLabel;
};

export const generateCustomMultiselectFlatFileHooks = (
  customMultiselects,
  intl,
) => {
  const safeWellKeyedCustomMultiselects =
    keyBy(customMultiselects, 'key') || [];

  const customFieldHooks = mapValues(
    safeWellKeyedCustomMultiselects,
    customMultiselectField => {
      const options = get(customMultiselectField, 'options', []).map(
        opt => opt?.value,
      );
      return values =>
        validateStrings(
          options,
          values,
          'MATCHED_OPTION_MESSAGE',
          'UNMATCHED_OPTION_MESSAGE',
          intl,
        );
    },
  );

  return customFieldHooks;
};

export const addValidMultiselectOptionsToSightingData = (
  sightingData,
  customMultiselects,
) => {
  const validatedSightingData = map(sightingData, sighting => {
    const multiselectCustomFields = reduce(
      customMultiselects,
      (memo, currentMultiSelectField) => {
        const currentSightingOpts =
          get(sighting, [currentMultiSelectField?.key])
            ?.split(',')
            ?.map(opt => opt.trim()) || [];
        const allValidOpts =
          get(currentMultiSelectField, ['options'])?.map(
            validOptObj => validOptObj?.label,
          ) || [];
        const validCurrentSightingOpts = filter(
          currentSightingOpts,
          currentSightingOpt =>
            allValidOpts.includes(currentSightingOpt),
        );
        const newField = {};
        newField[
          (currentMultiSelectField?.key)
        ] = validCurrentSightingOpts;
        return { ...memo, ...newField };
      },
      {},
    );
    return { ...sighting, ...multiselectCustomFields };
  });
  return validatedSightingData;
};
