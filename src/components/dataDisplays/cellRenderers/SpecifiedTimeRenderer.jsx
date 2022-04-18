import React, { forwardRef } from 'react';
import { get } from 'lodash-es';

import { formatDateCustom } from '../../../utils/formatters';
import timePrecisionMap from '../../../constants/timePrecisionMap';
import Text from '../../Text';

function SpecifiedTimeRenderer(
  {
    datum,
    timeProperty = 'time',
    specificityProperty = 'timeSpecificity',
  },
  ref,
) {
  const time = get(datum, timeProperty);
  const specificity = get(datum, specificityProperty);

  const formatSpecification = get(
    timePrecisionMap,
    [specificity, 'intlFormat'],
    'yyyy-MM-dd',
  );

  return (
    <Text variant="body2" ref={ref}>
      {formatDateCustom(time, formatSpecification)}
    </Text>
  );
}

export default forwardRef(SpecifiedTimeRenderer);
