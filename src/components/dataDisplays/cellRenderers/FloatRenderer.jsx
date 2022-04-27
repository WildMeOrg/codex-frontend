import React from 'react';
import { round } from 'lodash-es';

import Text from '../../Text';

export default function FloatRenderer({ value, precision = 2 }) {
  return <Text variant="body2">{round(value, precision)}</Text>;
}
