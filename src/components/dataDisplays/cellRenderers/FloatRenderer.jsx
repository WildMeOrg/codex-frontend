import React from 'react';
import { isNaN, round } from 'lodash-es';

import Text from '../../Text';

export default function FloatRenderer({
  value,
  precision = 2,
  fallback = '-',
}) {
  const roundedNumber = round(value, precision);
  const displayNumber = isNaN(roundedNumber)
    ? fallback
    : roundedNumber;
  return <Text variant="body2">{displayNumber}</Text>;
}
