import React from 'react';
import GoogleMapReact from 'google-map-react';
// import  from 'google-map-react';

import { googleMapsApiKey } from '../../constants/apiKeys';
import { get } from 'lodash';

function createMapOptions() {
  return {
    gestureHandling: 'cooperative',
  };
}

const Marker = ({ text }) => <div>{text}</div>;

export default function ManyPoints({ latLongLabelArr }) {
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
      defaultCenter={{ lat: 0, lng: 0 }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => {
        const bounds = new maps.LatLngBounds();
        console.log('deleteMe GoogleMapReact render fired');
        const markerArr = [];
        latLongLabelArr.forEach(entry => {
          const currentLat = get(entry, 'lat');
          const currentLong = get(entry, 'long');
          if (currentLat && currentLong) {
            const latLng = new maps.LatLng(currentLat, currentLong);
            const marker = new maps.Marker({
              position: latLng,
              title: get(entry, 'text'),
            });
            marker.setMap(map);
            // const infoWindow = new maps.InfoWindow({
            //   content: get(entry, 'text'),
            //   map: map,
            // });

            // maps.event.addListener(marker, 'click', () => {
            //   console.log('deleteMe hey! Clicked!');
            //   infoWindow.setContent(get(entry, 'text'));
            //   console.log('deleteMe infoWindow is: ');
            //   console.log(infoWindow);
            //   infoWindow.open(map, this);
            //   console.log('deleteMe done');
            // });
            markerArr.push(marker);
            bounds.extend(latLng);
          }
        });

        // markerArr.forEach(marker => {
        //   bounds.extend(marker.position);
        // });
        map.fitBounds(bounds);

        // map.fitBounds(bounds);

        maps.event.addListener(map, 'bounds_changed', function() {
          console.log(
            'deleteMe got here and bounds changed in the end',
          );
          markerArr.forEach(marker => {
            const infoWindow = new maps.InfoWindow({
              content: get(marker, 'title'),
              map: map,
            });

            marker.addListener('click', () => {
              infoWindow.open(marker.get('map'), marker);
            });

            // maps.event.addListener(marker, 'click', () => {
            //   console.log('deleteMe hey! Clicked!');
            //   infoWindow.setContent(get(marker, 'title'));
            //   console.log('deleteMe infoWindow is: ');
            //   console.log(infoWindow);
            //   infoWindow.open(map, this);
            //   console.log('deleteMe done');
            // });
          });
        });
      }}
    >
      {/* {latLongLabelArr.map(entry => {
        const tmpLat = get(entry, 'lat');
        const tmpLong = get(entry, 'long');
        return (
          <Marker
            text={get(entry, 'text', '')}
            style={{ outlineColor: 'red' }}
            key={get(entry, 'text', '')}
            name={get(entry, 'text', '')}
            lat={get(entry, 'lat')}
            lng={get(entry, 'long')}
          />
        );
      })} */}
    </GoogleMapReact>
  );
}
