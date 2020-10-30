import React from 'react';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';

export default function TaxonomyRenderer({ value }) {
  const scientificNames = value.map(t => get(t, 'scientificName'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {scientificNames.map(name => (
        <Typography key={name}>{name}</Typography>
      ))}
    </div>
  );
}
