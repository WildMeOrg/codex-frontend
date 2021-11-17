import React from 'react';
import SinglePoint from '../maps/SinglePoint';
import Card from './Card';

export default function GpsCard({
  title,
  titleId = 'LOCATION',
  lat,
  lng,
}) {
  return (
    <Card title={title} titleId={titleId}>
      <div style={{ height: 280, marginTop: 4 }}>
        <SinglePoint lat={lat} lng={lng} />
      </div>
    </Card>
  );
}
