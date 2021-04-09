import React from 'react';
import { get } from 'lodash-es';
import Text from '../Text';

export default function OptionRenderer({
  value,
  choices,
  lookupKey = 'value',
  labelKey = 'label',
  defaultLabel = 'Option label not found',
}) {
  const selectedOption = choices.find(
    choice => choice[lookupKey] === value,
  );
  return (
    <Text component="span" variant="body2">
      {get(selectedOption, labelKey, defaultLabel)}
    </Text>
  );
}
