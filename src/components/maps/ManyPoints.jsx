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
        let currentSouthernmostLat = 0; // ended up having to do this manually because the asynchronicity of bounds.extend(latLng) was proving intractable
        let currentEasternmostLong = 0;
        let currentNorthernmostLat = 0;
        let currentWesternmostLong = 0;
        latLongLabelArr.forEach(entry => {
          const currentLat = get(entry, 'lat');
          const currentLong = get(entry, 'long');
          if (currentLat && currentLong) {
            if (currentLat < currentSouthernmostLat)
              currentSouthernmostLat = currentLat;
            if (currentLat > currentNorthernmostLat)
              currentNorthernmostLat = currentLat;
            if (currentLong < currentWesternmostLong)
              currentWesternmostLong = currentLong;
            if (currentLong > currentEasternmostLong)
              currentEasternmostLong = currentLong;
          }
        });
        const sw = new maps.LatLng(
          currentSouthernmostLat,
          currentWesternmostLong,
        );
        const ne = new maps.LatLng(
          currentNorthernmostLat,
          currentEasternmostLong,
        );
        const bounds = new maps.LatLngBounds(sw, ne);
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds, 10);
        var opt = { minZoom: 0, maxZoom: 15 };
        map.setOptions(opt);
        map.setZoom(Math.max(map.getZoom() - 1, 0)); // add some buffer space to it
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
