import React from 'react';
import { round } from 'lodash-es';
import Text from '../../Text';

export default function FloatViewer({
  value,
  defaultLabel = '',
  precision = 2,
}) {
  const printableValue =
    value === null ? defaultLabel : round(value, precision);
  return (
    <Text component="span" variant="body2">
      {printableValue}
    </Text>
  );
}
