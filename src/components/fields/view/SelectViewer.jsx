import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Text from '../../Text';

export default function SelectViewer({
  value,
  schema,
  lookupKey = 'value',
  labelKey = 'label',
  labelIdKey = 'labelId',
  defaultLabel,
}) {
  const intl = useIntl();
  const { choices } = schema;

  const selectedOption = choices.find(
    choice => choice[lookupKey] === value,
  );

  const translatedDefaultLabel =
    defaultLabel ||
    intl.formatMessage({ id: 'OPTION_LABEL_NOT_FOUND' });
  let label = get(selectedOption, labelKey, translatedDefaultLabel);
  if (value === null || value === undefined) {
    label = intl.formatMessage({ id: 'Value not set' });
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
