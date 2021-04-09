import React from 'react';
import GoogleMapReact from 'google-map-react';

import { googleMapsApiKey } from '../../constants/apiKeys';
import Card from './Card';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

export default function GpsCard({
  title,
  titleId = 'LOCATION',
  lat,
  lng,
}) {
  return (
    <Card title={title} titleId={titleId}>
      <div style={{ height: 280, marginTop: 4 }}>
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
      </div>
    </Card>
  );
}
