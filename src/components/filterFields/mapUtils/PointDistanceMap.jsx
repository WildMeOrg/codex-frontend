import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { googleMapsApiKey } from '../../../constants/apiKeys';

let lastMarker = null;
let lastCircle = null;

/* component expects distance in kilometers */
export default function PointDistanceMap({
  distance = 50,
  onChange,
  ...rest
}) {
  const [mapObject, setMapObject] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);

  useEffect(
    () => {
      if (lastCircle) {
        lastCircle.setOptions({
          radius: 1000 * distance,
        });
      }
    },
    [distance],
  );

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
          onChange({ lat, lng });
          if (lastMarker) lastMarker.setMap(null); // remove old marker
          if (lastCircle) lastCircle.setMap(null); // remove old circle

          const markerPosition = new mapsApi.LatLng(lat, lng);

          const circle = new mapsApi.Circle({
            center: markerPosition,
            radius: 1000 * distance,
            strokeColor: '#000000',
            strokeWeight: 2,
            strokeOpacity: 0.8,
            fillColor: '#000000',
            fillOpacity: 0.35,
          });

          circle.setMap(mapObject);

          const marker = new mapsApi.Marker({
            position: markerPosition,
          });
          marker.setMap(mapObject);

          lastMarker = marker;
          lastCircle = circle;
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
