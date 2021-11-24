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
  console.log('deleteMe latLongLabelArr is: ');
  console.log(latLongLabelArr);
  return (
    <GoogleMapReact
      ref={ref => {
        this.map = ref;
      }}
      options={createMapOptions}
      bootstrapURLKeys={{ key: googleMapsApiKey }} // defaultCenter={{ lat, lng }}
      defaultZoom={7}
      yesIWantToUseGoogleMapApiInternals
    >
      {latLongLabelArr.map(entry => (
        <Marker
          key={get(entry, 'text', '')}
          name={get(entry, 'text', '')}
          position={{
            lat: get(entry, 'lat'),
            long: get(entry, 'long'),
          }}
        />
      ))}
    </GoogleMapReact>
  );
}
