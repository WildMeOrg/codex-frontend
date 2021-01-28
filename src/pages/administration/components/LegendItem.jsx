import React from 'react';
import Text from '../../../components/Text';

export default function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <dt
        aria-label={`${color} legend box`}
        style={{
          backgroundColor: color,
          display: 'inline-block',
          width: 12,
          height: 12,
          marginRight: 6,
        }}
      />
      <Text variant="body1" component="dd" display="inline">
        {label}
      </Text>
    </div>
  );
}
