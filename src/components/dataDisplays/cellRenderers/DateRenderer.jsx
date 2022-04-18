import React, { forwardRef } from 'react';
import { get } from 'lodash-es';
import { formatDate } from '../../../utils/formatters';
import Text from '../../Text';

function DateRenderer({ datum, accessor = 'created' }, ref) {
  return (
    <Text component="span" variant="body2" ref={ref}>
      {formatDate(get(datum, accessor, ''))}
    </Text>
  );
}

export default forwardRef(DateRenderer);
