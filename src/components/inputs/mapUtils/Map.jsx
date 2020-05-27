import React from 'react';
import GoogleMapReact from 'google-map-react';
import { googleMapsApiKey } from '../../../constants/apiKeys';
import Marker from './Marker';

export default function Map({ onChange, markerLocation, rest }) {

  const handleApiLoaded = (map, maps) => {
    console.log(map);
    map.minZoom = 1;
  };

  return (
    <div style={{ height: 400, width: 500, maxWidth: '100%', maxHeight: '50vh' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsApiKey }}
        defaultCenter={{
          lat: 0,
          lng: 0,
        }}
        defaultZoom={5}
        onClick={({ lat, lng }) => {
          onChange([lat, lng]);
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) =>
          handleApiLoaded(map, maps)
        }
        {...rest}
      >
        <Marker lat={markerLocation ? markerLocation[0] : undefined} lng={markerLocation ? markerLocation[1] : undefined} />
      </GoogleMapReact>
    </div>
  );
}
