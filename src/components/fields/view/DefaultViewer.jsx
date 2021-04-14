import React from 'react';
import Text from '../../Text';

export default function DefaultViewer({ value, defaultLabel = '' }) {
  let printableValue = defaultLabel;
  if (value) {
    printableValue =
      typeof value === 'string' ? value : JSON.stringify(value);
  }
  return (
    <Text component="span" variant="body2">
      {printableValue}
    </Text>
  );
}
