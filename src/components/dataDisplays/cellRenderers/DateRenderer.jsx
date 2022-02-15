import React from 'react';
import { formatDate } from '../../../utils/formatters';
import Text from '../../Text';
import { get } from 'lodash-es';

export default function DateRenderer({ datum }) {
  return (
    <Text component="span" variant="body2">
      {formatDate(get(datum, 'created', ''))}
    </Text>
  );
}
