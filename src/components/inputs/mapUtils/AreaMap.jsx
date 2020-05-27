import React from 'react';
import { get } from 'lodash-es';
import GoogleMapReact from 'google-map-react';
import { googleMapsApiKey } from '../../../constants/apiKeys';
import { defaultAreaBounds } from '../../../constants/defaults';

export default function Map({ startBounds, onChange, rest }) {
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
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          const rect = new maps.Rectangle({
            bounds: startBounds || defaultAreaBounds,
            editable: true,
            draggable: true,
          });

          rect.setMap(map);

          maps.event.addListener(rect, 'bounds_changed', () => {
            const bounds = rect.getBounds();
            const north = get(bounds, 'Ya.j', null);
            const south = get(bounds, 'Ya.i', null);
            const east = get(bounds, 'Ua.j', null);
            const west = get(bounds, 'Ua.i', null);

            onChange({ north, south, east, west });
          });
        }}
        {...rest}
      />
    </div>
  );
}
