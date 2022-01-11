import React from 'react';
import { get } from 'lodash-es';

import { formatDateCustom } from '../../../utils/formatters';
import timePrecisionMap from '../../../constants/timePrecisionMap';
import Text from '../../Text';

export default function SpecifiedTimeViewer({ value }) {
  const timeSpecificity = get(value, 'timeSpecificity', '');
  const time = get(value, 'time');
  const formatSpecification = get(
    timePrecisionMap,
    [timeSpecificity, 'intlFormat'],
    'yyyy-MM-dd',
  );

  return (
    <Text component="span" variant="body2">
      {formatDateCustom(time, formatSpecification)}
    </Text>
  );
}
