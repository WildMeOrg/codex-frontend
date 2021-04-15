import React from 'react';
import { formatDate } from '../../../utils/formatters';
import Text from '../../Text';

export default function DateViewer({
  value,
  defaultLabel = 'Date not set',
}) {
  const printableValue = value ? formatDate(value) : defaultLabel;
  return (
    <Text component="span" variant="body2">
      {printableValue}
    </Text>
  );
}
