import React from 'react';
import GoogleMapReact, { Marker } from 'google-map-react';
// import  from 'google-map-react';

import { googleMapsApiKey } from '../../constants/apiKeys';
import { get } from 'lodash';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

export default function ManyPoints({ latLongLabelArr }) {
  console.log('deleteMe got here');
  console.log('deleteMe latLongLabelArr is: ');
  console.log(latLongLabelArr);
  console.log('deleteMe hey there!!');
  return (
    <GoogleMapReact
      options={createMapOptions}
      bootstrapURLKeys={{ key: googleMapsApiKey }}
      defaultZoom={7}
    >
      {latLongLabelArr.map(entry => {
        console.log('deleteMe entry is: ');
        console.log(entry);
        return (
          <Marker
            key={get(entry, 'text', '')}
            name={get(entry, 'text', '')}
            position={{
              lat: get(entry, 'lat'),
              long: get(entry, 'long'),
            }}
          />
        );
      })}
    </GoogleMapReact>
  );
}
