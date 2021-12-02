import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

import { googleMapsApiKey } from '../../constants/apiKeys';
import { get } from 'lodash';

import Marker from './Marker';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

export default function ManyPoints({ latLongLabelArr }) {
  const [clickAwayClicked, setClickAwayClicked] = useState(false);
  return (
    <GoogleMapReact
      options={createMapOptions}
      bootstrapURLKeys={{ key: googleMapsApiKey }}
      defaultZoom={1}
      defaultCenter={
        { lat: 0, lng: 0 } // doesn't matter but both zoom and center need defaults
      }
      yesIWantToUseGoogleMapApiInternals
      onChildMouseDown={() => {}}
      onClick={() => {
        setClickAwayClicked(true);
      }}
      onGoogleApiLoaded={({ map, maps }) => {
        const bounds = new maps.LatLngBounds();
        // map.addListener('idle', () => {
        //   // const listener = maps.event.addListener(map, 'idle', () => {
        //   // if (map.getZoom() > 16) map.setZoom(16);
        //   // map.setOptions({ maxZoom: null });
        //   console.log('deleteMe idle is reached and bounds is: ');
        //   console.log(bounds);
        //   map.fitBounds(bounds, 10);
        //   // map.panToBounds(bounds);
        //   // maps.event.removeListener(listener);
        //   maps.event.clearListeners(map, 'idle');
        // });
        latLongLabelArr.forEach(entry => {
          const currentLat = get(entry, 'lat');
          const currentLong = get(entry, 'long');
          if (currentLat && currentLong) {
            console.log('deleteMe got here for entry:');
            console.log(entry);
            const latLng = new maps.LatLng(currentLat, currentLong);
            bounds.extend(latLng);
            // map.fitBounds(bounds, 10);
            // map.panToBounds(bounds);
          }
        });
        maps.event.addListenerOnce(map, 'bounds_changed', function(
          event,
        ) {
          console.log('deleteMe got here b1');
          this.setZoom(map.getZoom() - 1);

          if (this.getZoom() > 15) {
            this.setZoom(15);
          }
        });
        console.log('deleteMe got here and bounds is: ');
        console.log(bounds);
        // map.setOptions({ maxZoom: 0 });
        map.fitBounds(bounds, 10);
        // map.panToBounds(bounds);
        // map.addListener('bounds_changed', () => {
        //   // const listener = maps.event.addListener(map, 'idle', () => {
        //   // if (map.getZoom() > 16) map.setZoom(16);
        //   // map.setOptions({ maxZoom: null });
        //   console.log(
        //     'deleteMe bounds_changed is reached and bounds is: ',
        //   );
        //   console.log(bounds);
        //   map.fitBounds(bounds, 10);
        //   // map.panToBounds(bounds);
        //   // maps.event.removeListener(listener);
        //   maps.event.clearListeners(map, 'bounds_changed');
        // });
        console.log('deleteMe got here and mapFitBounds has run');
      }}
    >
      {latLongLabelArr.map(entry => {
        return (
          <Marker
            entry={entry}
            clickAwayClicked={clickAwayClicked}
            setClickAwayClicked={setClickAwayClicked}
            style={{ outlineColor: 'red' }}
            key={get(entry, 'text', '')}
            lat={get(entry, 'lat')}
            lng={get(entry, 'long')}
          />
        );
      })}
    </GoogleMapReact>
  );
}
