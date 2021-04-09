import React from 'react';
import { round } from 'lodash-es';
import Text from '../Text';

export default function GpsRenderer({ value }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <Text component="span" variant="body2">{`Decimal latitude: ${
        round(value[0], 4)
      }`}</Text>
      <Text component="span" variant="body2">{`Decimal longitude: ${
        round(value[1], 4)
      }`}</Text>
    </span>
  );
}
