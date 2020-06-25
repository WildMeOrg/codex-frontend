import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import { googleMapsApiKey } from '../../../constants/apiKeys';
import LabeledInput from '../../../components/LabeledInput';
import fakeData from './fakeData';

const data = fakeData.map(datum => ({
  lat: datum.latitude,
  lng: datum.longitude,
  weight: 2,
}));

const height = 800;
const width = '100vw';

export default function Map({
  interactive,
  onSetInteractive,
  onDisableInteractive,
  rest,
}) {
  const [googlemap, setGooglemap] = useState(null);
  // const [species, setSpecies] = useState(null);
  const [time, setTime] = useState('all');

  useEffect(
    () => {
      if (interactive && googlemap) {
        setTimeout(() => {
          googlemap.setOptions({
            zoomControl: true,
            fullscreenControl: true,
          });
        }, 1000);
      }

      if (!interactive && googlemap) {
        googlemap.setOptions({
          zoomControl: false,
          fullscreenControl: false,
        });
      }
    },
    [interactive],
  );

  return (
    <div>
      {interactive && (
        <div
          style={{
            display: 'flex',
            padding: 20,
            justifyContent: 'space-between',
          }}
        >
          <Button
            startIcon={<BackIcon />}
            onClick={onDisableInteractive}
          >
            <FormattedMessage id="BACK" />
          </Button>
          <div>
            <LabeledInput
              value="grampus"
              onChange={() => {}}
              width={200}
              style={{ marginRight: 20 }}
              schema={{
                labelId: 'SPECIES',
                fieldType: 'select',
                choices: [
                  {
                    value: 'grampus',
                    label: 'Grampus Griseus',
                  },
                ],
              }}
            />
            <LabeledInput
              value={time}
              onChange={(t) => setTime(t)}
              width={200}
              schema={{
                labelId: 'TIME',
                fieldType: 'select',
                choices: [
                  {
                    value: 'all',
                    labelId: 'ALL_TIME',
                  },
                  {
                    value: 'day',
                    labelId: 'LAST_24_HOURS',
                  },
                  {
                    value: 'week',
                    labelId: 'LAST_7_DAYS',
                  },
                  {
                    value: 'month',
                    labelId: 'LAST_30_DAYS',
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
      <div
        style={{
          height,
          maxHeight: '80vh',
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
          onGoogleApiLoaded={({ map }) => {
            setGooglemap(map);
          }}
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
          {...rest}
        />
        <div
          style={{
            position: 'absolute',
            opacity: interactive ? 0 : 1,
            pointerEvents: interactive ? 'none' : 'unset',
            transition: 'opacity 1s ease-in-out',
            height,
            maxHeight: '80vh',
            width,
            top: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            opacity: interactive ? 0 : 1,
            pointerEvents: interactive ? 'none' : 'unset',
            transition: 'opacity 1s ease-in-out',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            width: 500,
            maxWidth: '80vw',
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
                <FormattedMessage
                  id="SITE_DATABASE_TAGLINE"
                  values={{ siteName: 'Flukebook' }}
                />
              </Typography>
            </Grid>
            <Grid item style={{ marginTop: 20 }}>
              <Typography>
                <FormattedMessage
                  id="X_SIGHTINGS"
                  values={{ x: '42,012' }}
                />
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                <FormattedMessage
                  id="X_INDIVIDUALS"
                  values={{ x: '8,521' }}
                />
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                <FormattedMessage
                  id="X_RESEARCHERS"
                  values={{ x: '85' }}
                />
              </Typography>
            </Grid>
            <Button
              variant="outlined"
              style={{ marginTop: 20, borderColor: 'black' }}
              onClick={onSetInteractive}
            >
              <FormattedMessage id="EXPLORE_PUBLIC_DATA" />
            </Button>
          </Grid>
        </div>
      </div>
      {interactive && (
        <Typography style={{ margin: 12 }}>
          <FormattedMessage id="MAP_DATA_NOTE" />
        </Typography>
      )}
    </div>
  );
}
