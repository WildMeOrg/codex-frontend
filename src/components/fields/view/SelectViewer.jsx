import React from 'react';
import { get } from 'lodash-es';
import Text from '../../Text';

export default function SelectViewer({
  value,
  schema,
  lookupKey = 'value',
  labelKey = 'label',
  labelIdKey = 'labelId',
  defaultLabel = 'Option label not found',
}) {
  const { choices } = schema;

  const selectedOption = choices.find(
    choice => choice[lookupKey] === value,
  );

  let label = get(selectedOption, labelKey, defaultLabel);
  if (value === null || value === undefined) {
    label = 'Value not set';
  }

  return (
    <Text
      component="span"
      variant="body2"
      id={get(selectedOption, labelIdKey, undefined)}
    >
      {label}
    </Text>
  );
}
