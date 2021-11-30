import React from 'react';
import GoogleMapReact from 'google-map-react';
// import  from 'google-map-react';

import { googleMapsApiKey } from '../../constants/apiKeys';
import { get } from 'lodash';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

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
      defaultCenter={{ lat: 0, lng: 0 }}
      yesIWantToUseGoogleMapApiInternals
    >
      {latLongLabelArr.map(entry => {
        console.log('deleteMe entry is: ');
        console.log(entry);
        const tmpLat = get(entry, 'lat');
        console.log('typeof tmpLat is: ');
        console.log(typeof tmpLat);
        const tmpLong = get(entry, 'long');
        console.log('typeof tmpLong is: ');
        console.log(typeof tmpLong);
        return (
          <AnyReactComponent
            style={{ outlineColor: 'red' }}
            key={get(entry, 'text', '')}
            name={get(entry, 'text', '')}
            lat={get(entry, 'lat')}
            lng={get(entry, 'long')}
          />
        );
        // position={{
        //   lat: get(entry, 'lat'),
        //   long: get(entry, 'long'),
        // }}
      })}
    </GoogleMapReact>
  );
}
