import { get } from 'lodash';
import React from 'react';
import ManyPoints from '../maps/ManyPoints';
import Card from './Card';

export default function SightingMapViewCard({
  title,
  titleId = 'LOCATION',
  data,
}) {
  // console.log('deleteMe got here and data is:');
  // console.log(data);
  const transformedData = data
    .filter(entry => get(entry, 'decimalLatitude', null) !== null)
    .map(entry => {
      return {
        guid: get(entry, 'id'),
        text:
          'Sighting on ' + get(entry, 'startTime', 'Unknown Date'),
        lat: get(entry, 'decimalLatitude', null),
        long: get(entry, 'decimalLongitude', null),
      }; // TODO internationalize Unknown date text
    });
  console.log('deleteMe transformedData is: ');
  console.log(transformedData);
  // const sigtingItems = transformedData.map(entry => (
  //   <ManyPoints
  //     lat={get(entry, 'lat', null)}
  //     lng={get(entry, 'long', null)}
  //   />
  // )); // TODO maybe replace single point with something similar? And add text in

  // console.log('deleteMe sigtingItems is: ');
  // console.log(sigtingItems);
  return (
    <Card title={title} titleId={titleId}>
      <div style={{ height: 280, marginTop: 4 }}>
        <ManyPoints latLongLabelArr={transformedData} />
      </div>
    </Card>
  );
}
