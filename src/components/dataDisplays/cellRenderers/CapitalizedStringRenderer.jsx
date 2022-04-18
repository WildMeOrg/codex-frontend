import React, { forwardRef } from 'react';
import { capitalize } from 'lodash-es';

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

export default function CapitalizedStringRenderer({
  value,
  noWrap = false,
}) {
  const capitalizedValue = capitalize(value);

  const coreComponent = <CoreForwardRef value={capitalizedValue} />;

  return noWrap ? (
    <OverflowController title={capitalizedValue}>
      {coreComponent}
    </OverflowController>
  ) : (
    coreComponent
  );
}
