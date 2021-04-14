import React from 'react';
import Text from '../../Text';

export default function DefaultViewer({ value, defaultLabel = '' }) {
  const printableValue =
    value === null ? defaultLabel : JSON.stringify(value);
  return (
    <Text component="span" variant="body2">
      {printableValue}
    </Text>
  );
}
