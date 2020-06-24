import React from 'react';
import GoogleMapReact from 'google-map-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { googleMapsApiKey } from '../../../constants/apiKeys';
import fakeData from './fakeData';

const data = fakeData.map(datum => ({
  lat: datum.latitude,
  lng: datum.longitude,
  weight: 2,
}));

const height = 800;
const width = '100vw';

export default function Map({ rest }) {
  return (
    <div
      style={{
        height,
        width,
        position: 'relative',
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsApiKey }}
        defaultCenter={{
          lat: 0,
          lng: 0,
        }}
        defaultZoom={2.4}
        options={{
          minZoom: 1,
          zoomControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'landscape',
              elementType: 'fill',
              stylers: [{ color: '#fff9f0' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffc96b' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#cce0ff' }],
            },
          ],
        }}
        yesIWantToUseGoogleMapApiInternals
        heatmapLibrary
        heatmap={{
          positions: data,
          options: {
            radius: 16,
            opacity: 1,
            gradient: [
              'rgba(242,240,247, 0)',
              'rgba(120,22,216, 1)',
              'rgba(255,44,44, 1)',
              'rgba(255,224,62, 1)',
            ],
          },
        }}
        onGoogleApiLoaded={({ map, maps }) => {
          console.log(map, maps);
        }}
        {...rest}
      />
      <div
        style={{
          position: 'absolute',
          height,
          width,
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          width: 500,
          height: 300,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 0 32px rgba(0,0,0,0.8)',
          borderRadius: 4,
        }}
      >
        <Grid
          container
          alignItems="center"
          spacing={1}
          direction="column"
          style={{ marginTop: 40 }}
        >
          <Grid item>
            <Typography variant="h5">
              The Flukebook Database
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: 20 }}>
            <Typography>21,452 sightings</Typography>
          </Grid>
          <Grid item>
            <Typography>4,218 individuals</Typography>
          </Grid>

          <Grid item>
            <Typography>82 researchers</Typography>
          </Grid>
          <Button
            variant="outlined"
            style={{ marginTop: 20, borderColor: 'black' }}
          >
            Explore public data
          </Button>
        </Grid>
      </div>
    </div>
  );
}
