import React from 'react';
import GoogleMapReact from 'google-map-react';

import useGoogleMapsApiKey from '../../hooks/useGoogleMapsApiKey';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

export default function SinglePoint({ lat, lng }) {
  const googleMapsApiKey = useGoogleMapsApiKey();
  return (
    <GoogleMapReact
      options={createMapOptions}
      bootstrapURLKeys={{ key: googleMapsApiKey }}
      defaultCenter={{
        lat,
        lng,
      }}
      defaultZoom={7}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => {
        const markerPosition = new maps.LatLng(lat, lng);
        const marker = new maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      }}
    />
  );
}
