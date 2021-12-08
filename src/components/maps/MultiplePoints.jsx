import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { get } from 'lodash-es';
import RoomIcon from '@material-ui/icons/Room';

import { googleMapsApiKey } from '../../constants/apiKeys';
import Marker from './Marker';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

export default function ManyPoints({ latLongLabelArr }) {
  const [currentMarkerToShow, setCurrentMarkerToShow] = useState(
    null,
  );
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
        setCurrentMarkerToShow(null);
      }}
      onGoogleApiLoaded={({ map, maps }) => {
        let southernmostLat = null; // ended up having to do this manually because the asynchronicity of bounds.extend(latLng) was proving intractable despite a lot of experimentation and research
        let easternmostLong = null;
        let northernmostLat = null;
        let westernmostLong = null;
        latLongLabelArr.forEach(entry => {
          const currentLat = get(entry, 'lat');
          const currentLong = get(entry, 'long');
          if (currentLat && currentLong) {
            if (currentLat < southernmostLat || !southernmostLat)
              southernmostLat = currentLat;
            if (currentLat > northernmostLat || !northernmostLat)
              northernmostLat = currentLat;
            if (currentLong < westernmostLong || !westernmostLong)
              westernmostLong = currentLong;
            if (currentLong > easternmostLong || !easternmostLong)
              easternmostLong = currentLong;
          }
        });
        const sw = new maps.LatLng(southernmostLat, westernmostLong);
        const ne = new maps.LatLng(northernmostLat, easternmostLong);
        const bounds = new maps.LatLngBounds(sw, ne);
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds, 10);
        var opt = { minZoom: 0, maxZoom: 5 };
        map.setOptions(opt);
        map.setZoom(Math.max(map.getZoom() - 1, 0)); // add some buffer space to it
      }}
    >
      {latLongLabelArr.map(entry => {
        return (
          <Marker
            entry={entry}
            currentMarkerToShow={currentMarkerToShow}
            setCurrentMarkerToShow={setCurrentMarkerToShow}
            key={get(entry, 'text', '')}
            lat={get(entry, 'lat')}
            lng={get(entry, 'long')}
          >
            <RoomIcon />
          </Marker>
        );
      })}
    </GoogleMapReact>
  );
}
