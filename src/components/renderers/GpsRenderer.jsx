import React from 'react';
import Text from '../Text';

export default function GpsRenderer({ value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>{value[0]}</Text>
      <Text>{value[1]}</Text>
    </div>
  );
}
