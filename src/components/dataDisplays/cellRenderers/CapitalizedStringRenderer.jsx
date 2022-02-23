import React from 'react';

import { capitalize } from 'lodash-es';

import Text from '../../Text';

export default function CapitalizedStringRenderer({ value }) {
  return <Text variant="body2">{capitalize(value)}</Text>;
}
