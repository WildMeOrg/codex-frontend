import React, { forwardRef } from 'react';
import { get } from 'lodash-es';

import { formatDate } from '../../../utils/formatters';
import OverflowController from './OverflowController';
import Text from '../../Text';

function Core({ value, ...rest }, ref) {
  return (
    <Text component="span" variant="body2" ref={ref} {...rest}>
      {value}
    </Text>
  );
}

const CoreForwardRef = forwardRef(Core);

export default function DateRenderer({
  datum,
  accessor = 'created',
  noWrap = false,
}) {
  const formattedValue = formatDate(get(datum, accessor, ''));

  const CoreComponent = <CoreForwardRef value={formattedValue} />;

  return noWrap ? (
    <OverflowController title={formattedValue}>
      {CoreComponent}
    </OverflowController>
  ) : (
    CoreComponent
  );
}
