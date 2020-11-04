import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function GpsRenderer({ value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography>{value[0]}</Typography>
      <Typography>{value[1]}</Typography>
    </div>
  );
}
