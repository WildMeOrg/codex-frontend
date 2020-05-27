import React from 'react';
import Typography from '@material-ui/core/Typography';

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
      <Typography variant="body1" component="dd" display="inline">
        {label}
      </Typography>
    </div>
  );
}
