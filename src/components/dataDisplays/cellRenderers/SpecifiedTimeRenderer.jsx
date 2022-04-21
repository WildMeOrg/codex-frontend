import React, { forwardRef } from 'react';
import { get } from 'lodash-es';

import { formatDateCustom } from '../../../utils/formatters';
import timePrecisionMap from '../../../constants/timePrecisionMap';
import OverflowController from './OverflowController';
import Text from '../../Text';

function Core({ value, ...rest }, ref) {
  return (
    <Text variant="body2" ref={ref} {...rest}>
      {value}
    </Text>
  );
}

const CoreForwardRef = forwardRef(Core);

export default function SpecifiedTimeRenderer({
  datum,
  timeProperty = 'time',
  specificityProperty = 'timeSpecificity',
  noWrap = false,
}) {
  const time = get(datum, timeProperty);
  const specificity = get(datum, specificityProperty);

  const formatSpecification = get(
    timePrecisionMap,
    [specificity, 'intlFormat'],
    'yyyy-MM-dd',
  );

  const formattedValue = formatDateCustom(time, formatSpecification);

  const CoreComponent = <CoreForwardRef value={formattedValue} />;

  return noWrap ? (
    <OverflowController title={formattedValue}>
      {CoreComponent}
    </OverflowController>
  ) : (
    CoreComponent
  );
}
