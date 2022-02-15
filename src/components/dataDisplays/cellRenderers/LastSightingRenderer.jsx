import React from 'react';
import { get } from 'lodash-es';

import Text from '../../Text';
import { formatDate } from '../../../utils/formatters';

export default function LastSightingtRenderer({ datum }) {
  return (
    <Text variant="body2">
      {formatDate(get(datum, 'last_sighting', ''))}
    </Text>
  );
}
