import React from 'react';
import { get } from 'lodash-es';
import { formatDate } from '../../../utils/formatters';
import Text from '../../Text';

export default function DateRangeViewer({
  value,
  defaultLabel = 'Date range not set',
}) {
  const startDate = get(value, 0);
  const endDate = get(value, 1);

  let printableValue;
  if (!startDate && !endDate) {
    printableValue = defaultLabel;
  } else if (!startDate) {
    printableValue = `- ${formatDate(endDate)}`;
  } else if (!endDate) {
    printableValue = `${formatDate(startDate)} -`;
  } else {
    printableValue = `${formatDate(startDate, true)} - ${formatDate(
      endDate, true
    )}`;
  }

  return (
    <Text component="span" variant="body2">
      {printableValue}
    </Text>
  );
}
