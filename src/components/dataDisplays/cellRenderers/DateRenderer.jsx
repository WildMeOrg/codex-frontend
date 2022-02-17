import React from 'react';
import { get } from 'lodash-es';
import { formatDate } from '../../../utils/formatters';
import Text from '../../Text';

export default function DateRenderer({
  datum,
  accessor = 'created',
}) {
  return (
    <Text component="span" variant="body2">
      {formatDate(get(datum, accessor, ''))}
    </Text>
  );
}
