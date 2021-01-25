import React from 'react';
import { get } from 'lodash-es';
import Text from '../Text';

export default function TaxonomyRenderer({ value }) {
  const scientificNames = value.map(t => get(t, 'scientificName'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {scientificNames.map(name => (
        <Text key={name}>{name}</Text>
      ))}
    </div>
  );
}
