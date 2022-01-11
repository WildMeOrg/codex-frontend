import React from 'react';
import { get } from 'lodash-es';

import { formatDateCustom } from '../../../utils/formatters';
import Text from '../../Text';

const formatMap = {
  year: {
    intlFormat: 'yyyy',
    usFormat: 'yyyy',
  },
  month: {
    intlFormat: 'yyyy-MM',
    usFormat: 'MM/yyyy',
  },
  day: {
    intlFormat: 'yyyy-MM-dd',
    usFormat: 'MM/dd/yyyy',
  },
  time: {
    intlFormat: 'yyyy-MM-dd HH:mm',
    usFormat: 'MM/dd/yyyy hh:mm',
  },
};

export default function SpecifiedTimeViewer({ value }) {
  const timeSpecificity = get(value, 'timeSpecificity', '');
  const time = get(value, 'time');
  const formatSpecification = get(
    formatMap,
    [timeSpecificity, 'intlFormat'],
    'yyyy-MM-dd',
  );

  return (
    <Text component="span" variant="body2">
      {formatDateCustom(time, formatSpecification)}
    </Text>
  );
}
