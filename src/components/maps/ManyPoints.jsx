import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import GoogleMapReact from 'google-map-react';

import { googleMapsApiKey } from '../../constants/apiKeys';
import { get } from 'lodash';

import Link from '../Link';
import Marker from './Marker';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

export default function ManyPoints({ latLongLabelArr }) {
  const [clickAwayClicked, setClickAwayClicked] = useState(false);
  console.log('deleteMe got here');
  console.log('deleteMe latLongLabelArr is: ');
  console.log(latLongLabelArr);
  console.log('deleteMe hey there!!');
  // const bounds = new window.google.maps.LatLngBounds();
  // latLongLabelArr.forEach(entry => {
  //   const latLng = new window.google.maps.LatLng(
  //     get(entry, 'lat'),
  //     get(entry, 'long'),
  //   );
  //   bounds.extend(latLng);
  // });
  return (
    <GoogleMapReact
      options={createMapOptions}
      bootstrapURLKeys={{ key: googleMapsApiKey }}
      defaultZoom={7}
      defaultCenter={
        { lat: 0, lng: 0 } // doesn't matter but both zoom and center need defaults
      }
      yesIWantToUseGoogleMapApiInternals
      onChildMouseDown={() => {}}
      onClick={() => {
        console.log('deleteMe a1 map clicked');
        setClickAwayClicked(true);
      }}
      onGoogleApiLoaded={({ map, maps }) => {
        const bounds = new maps.LatLngBounds();
        latLongLabelArr.forEach(entry => {
          const currentLat = get(entry, 'lat');
          const currentLong = get(entry, 'long');
          if (currentLat && currentLong) {
            const latLng = new maps.LatLng(currentLat, currentLong);
            // const marker = new maps.Marker({
            //   position: latLng,
            //   title: get(entry, 'text'),
            // });
            // marker.setMap(map);
            // const infoWindow = new maps.InfoWindow({
            //   content: ReactDOMServer.renderToString(
            //     <Link href={`/sightings/${get(entry, 'guid')}`}>
            //       {get(entry, 'text')}
            //     </Link>,
            //   ),
            //   map: map,
            // });
            // marker.addListener('click', () => {
            //   infoWindow.open(marker.get('map'), marker);
            // });
            bounds.extend(latLng);
          }
        });
        map.fitBounds(bounds);
        // maps.event.addListener(map, 'click', event => {
        //   console.log('deleteMe a1 map clicked before');
        //   setClickAwayClicked(true);
        //   // event.stopPropagation();
        //   console.log('deleteMe a1 map clicked after');
        // });
      }}
    >
      {latLongLabelArr.map(entry => {
        const tmpLat = get(entry, 'lat');
        const tmpLong = get(entry, 'long');
        return (
          <Marker
            entry={entry}
            clickAwayClicked={clickAwayClicked}
            setClickAwayClicked={setClickAwayClicked}
            text={get(entry, 'text', '')}
            style={{ outlineColor: 'red' }}
            key={get(entry, 'text', '')}
            name={get(entry, 'text', '')}
            lat={get(entry, 'lat')}
            lng={get(entry, 'long')}
          />
        );
      })}
    </GoogleMapReact>
  );
}
