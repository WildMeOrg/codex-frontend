import React from 'react';
import { get } from 'lodash-es';

import { formatSpecifiedTime } from '../../../utils/formatters';
import Text from '../../Text';

export default function SpecifiedTimeViewer({ value }) {
  const timeSpecificity = get(value, 'timeSpecificity', '');
  const time = get(value, 'time');

  return (
    <Text component="span" variant="body2">
      {formatSpecifiedTime(time, timeSpecificity)}
    </Text>
  );
}
