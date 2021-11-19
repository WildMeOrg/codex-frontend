import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { get } from 'lodash-es';

import { formatDate } from '../../utils/formatters';
import useOptions from '../../hooks/useOptions';
import StandardDialog from '../StandardDialog';
import Button from '../Button';
import MapInSighting from '../../pages/sighting/MapInSighting';
import ActionIcon from '../ActionIcon';
import DataDisplay from '../dataDisplays/DataDisplay';
import Card from './Card';

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
  sightings,
  columns = ['date', 'location', 'actions'],
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const [gpsCoordinates, setGpsCoordiates] = useState(null);
  const onClose = () => setModalOpen(false);
  const theme = useTheme();
  const { regionOptions } = useOptions();
  const intl = useIntl();

  const formatLocationFromSighting = (sighting, regionOpts) => {
    const currentSightingLocId = get(sighting, 'locationId', '');
    const currentLabelArray = regionOpts
      .filter(
        region => get(region, 'value', '') === currentSightingLocId,
      )
      .map(regionObj =>
        get(
          regionObj,
          'label',
          intl.formatMessage({ id: 'REGION_NAME_REMOVED' }),
        ),
      );
    let currentLabel = null;
    if (currentLabelArray.length > 0)
      currentLabel = currentLabelArray[0];

    const currentSightingVerbatimLoc = get(
      sighting,
      'verbatimLocality',
      '',
    );
    const currentSightingLat = get(sighting, 'decimalLatitude', '');
    const currentSightingLong = get(sighting, 'decimalLongitude', '');
    if (currentSightingLocId && !currentSightingVerbatimLoc) {
      return (
        currentLabel ||
        intl.formatMessage({ id: 'REGION_NAME_REMOVED' })
      );
    }

    if (!currentSightingLocId && currentSightingVerbatimLoc) {
      return currentSightingVerbatimLoc;
    }
    if (
      !currentSightingLocId &&
      !currentSightingVerbatimLoc &&
      currentSightingLat &&
      currentSightingLong
    )
      return intl.formatMessage({ id: 'VIEW_ON_MAP' });

    if (currentSightingLocId && currentSightingVerbatimLoc) {
      return currentLabel
        ? currentLabel + ' (' + currentSightingVerbatimLoc + ')'
        : intl.formatMessage({ id: 'REGION_NAME_REMOVED' });
    }
    return '';
  };

  const sightingsWithLocationData = useMemo(
    () =>
      sightings.map(sighting => ({
        ...sighting,
        formattedLocation: formatLocationFromSighting(
          sighting,
          regionOptions,
        ),
      })),
    [get(sightings, 'length')],
  );

  const allColumns = [
    {
      reference: 'date',
      name: 'startTime',
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
      name: 'id',
      label: 'Actions',
      options: {
        customBodyRender: value => (
          <div>
            <ActionIcon
              variant="view"
              href={`/sightings/${value}`}
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
            style={{ color: theme.palette.primary.main }}
            aria-label="View list"
          >
            <ViewList />
          </IconButton>
          <IconButton aria-label="View chart">
            <ViewMap />
          </IconButton>
        </div>
      }
    >
      {sightings && (
        <DataDisplay
          noTitleBar
          tableSize="medium"
          columns={filteredColumns}
          data={sightingsWithLocationData}
        />
      )}
    </Card>,
  ];
}
