import React from 'react';
import Text from '../Text';

export default function GpsRenderer({ value }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <Text component="span" variant="body2">{`Decimal latitude: ${
        value[0]
      }`}</Text>
      <Text component="span" variant="body2">{`Decimal longitude: ${
        value[1]
      }`}</Text>
    </span>
  );
}
