import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { googleMapsApiKey } from '../../../constants/apiKeys';

let lastMarker = null;

export default function LatLngMap({ onChange, rest }) {
  const [mapObject, setMapObject] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);

  return (
    <div
      style={{
        height: 400,
        width: 500,
        maxWidth: '100%',
        maxHeight: '50vh',
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsApiKey }}
        defaultCenter={{
          lat: 0,
          lng: 0,
        }}
        defaultZoom={1.3}
        options={{ minZoom: 1 }}
        onClick={({ lat, lng }) => {
          onChange([lat, lng]);
          if (lastMarker) lastMarker.setMap(null); // remove old marker

          const markerPosition = new mapsApi.LatLng(lat, lng);
          const marker = new mapsApi.Marker({
            position: markerPosition,
          });
          marker.setMap(mapObject);

          lastMarker = marker;
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          setMapObject(map);
          setMapsApi(maps);
        }}
        {...rest}
      />
    </div>
  );
}
