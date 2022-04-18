import React, { forwardRef } from 'react';

import { capitalize } from 'lodash-es';

import Text from '../../Text';

function CapitalizedStringRenderer({ value }, ref) {
  return (
    <Text variant="body2" ref={ref}>
      {capitalize(value)}
    </Text>
  );
}

export default forwardRef(CapitalizedStringRenderer);
