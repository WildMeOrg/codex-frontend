import React from 'react';
import { get, round } from 'lodash-es';
import Text from '../../Text';

export default function LatLongViewer({ value }) {
  const lat = get(value, 0, null);
  const lng = get(value, 1, null);
  return (
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <Text component="span" variant="body2">
        {`Decimal latitude: ${round(lat, 3)}...`}
      </Text>
      <Text component="span" variant="body2">
        {`Decimal longitude: ${round(lng, 3)}...`}
      </Text>
    </span>
  );
}
