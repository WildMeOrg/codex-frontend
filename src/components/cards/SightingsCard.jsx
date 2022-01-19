import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { get } from 'lodash-es';

import {
  formatDate,
  formatLocationFromSighting,
} from '../../utils/formatters';
import useOptions from '../../hooks/useOptions';
import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Button from '../Button';
import MapInSighting from '../../pages/sighting/MapInSighting';
import ActionIcon from '../ActionIcon';
import DataDisplay from '../dataDisplays/DataDisplay';
import Card from './Card';
import SightingMapView from '../cards/SightingMapView';

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
  sightings,
  columns = ['date', 'location', 'actions'],
  onDelete,
  linkPath = 'sightings',
  noSightingsMsg = 'NO_SIGHTINGS',
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const [gpsCoordinates, setGpsCoordiates] = useState(null);
  const [showMapView, setShowMapView] = useState(false);
  const onClose = () => setModalOpen(false);
  const theme = useTheme();
  const { regionOptions } = useOptions();
  const intl = useIntl();

  const mapModeClicked = function() {
    setShowMapView(true);
  };

  const listModeClicked = function() {
    setShowMapView(false);
  };

  const sightingsWithLocationData = useMemo(
    () => {
      // hotfix //
      if (!sightings) return [];
      // hotfix //

      return sightings.map(sighting => ({
        ...sighting,
        formattedLocation: formatLocationFromSighting(
          sighting,
          regionOptions,
          intl,
        ),
      }));
    },
    [get(sightings, 'length')],
  );

  const allColumns = [
    {
      reference: 'date',
      name: 'time',
      label: 'Date',
      options: {
        customBodyRender: value => formatDate(value, true),
        getStringValue: value => formatDate(value, true),
      },
    },
    {
      reference: 'location',
      name: 'formattedLocation',
      label: 'Location',
      options: {
        customBodyRender: (_, sightingObj) => {
          const currentSightingLat = get(
            sightingObj,
            'decimalLatitude',
            '',
          );
          const currentSightingLong = get(
            sightingObj,
            'decimalLongitude',
            '',
          );
          if (!currentSightingLat && !currentSightingLong)
            return get(
              sightingObj,
              'formattedLocation',
              intl.formatMessage({ id: 'LOCATION_NAME_MISSING' }),
            );
          return (
            <Button
              display="link"
              onClick={() => {
                setGpsCoordiates({
                  lat: currentSightingLat,
                  lng: currentSightingLong,
                });
                setModalOpen(true);
              }}
            >
              {get(
                sightingObj,
                'formattedLocation',
                intl.formatMessage({ id: 'LOCATION_NAME_MISSING' }),
              )}
            </Button>
          );
        },
      },
    },
    {
      reference: 'actions',
      name: 'guid',
      label: 'Actions',
      options: {
        customBodyRender: value => (
          <div>
            <ActionIcon
              variant="view"
              href={`/${linkPath}/${value}`}
            />
            {onDelete && (
              <ActionIcon
                labelId="REMOVE"
                variant="delete"
                onClick={() => onDelete(value)}
              />
            )}
          </div>
        ),
      },
    },
  ];

  const filteredColumns = allColumns.filter(c =>
    columns.includes(c.reference),
  );

  const noSightings = sightings && sightings.length === 0;

  return [
    <StandardDialog
      open={modalOpen}
      onClose={onClose}
      titleId="GPS_TITLE"
    >
      <DialogContent style={{ marginBottom: 24 }}>
        <MapInSighting
          latitude={get(gpsCoordinates, 'lat')}
          longitude={get(gpsCoordinates, 'lng')}
        />
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button id="CLOSE" display="basic" onClick={onClose} />
      </DialogActions>
    </StandardDialog>,
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        <div>
          <IconButton
            style={
              showMapView ? {} : { color: theme.palette.primary.main }
            }
            aria-label="View list"
            onClick={listModeClicked}
          >
            <ViewList />
          </IconButton>
          <IconButton
            style={
              showMapView ? { color: theme.palette.primary.main } : {}
            }
            disabled={
              sightingsWithLocationData.filter(entry =>
                get(entry, 'decimalLatitude'),
              ).length < 1
            }
            aria-label="View map"
            onClick={mapModeClicked}
          >
            <ViewMap />
          </IconButton>
        </div>
      }
    >
      {noSightings && (
        <Text
          variant="body2"
          id={noSightingsMsg}
          style={{ marginTop: 12 }}
        />
      )}
      {!noSightings && !showMapView && (
        <DataDisplay
          noTitleBar
          tableSize="medium"
          columns={filteredColumns}
          data={sightingsWithLocationData}
        />
      )}
      {!noSightings && showMapView && (
        <SightingMapView
          data={sightingsWithLocationData}
          linkPath={linkPath}
        />
      )}
    </Card>,
  ];
}
