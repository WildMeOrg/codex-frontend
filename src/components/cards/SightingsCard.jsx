import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';

import { formatLocationFromSighting } from '../../utils/formatters';
import useOptions from '../../hooks/useOptions';
import ActionIcon from '../ActionIcon';
import { cellRendererTypes } from '../dataDisplays/cellRenderers';
import DataDisplay from '../dataDisplays/DataDisplay';
import Card from './Card';
import SightingMapView from '../cards/SightingMapView';

export default function SightingsCard({
  title,
  titleId,
  sightings,
  columns = ['date', 'location', 'actions'],
  onDelete,
  linkPath = 'sightings',
  noSightingsMsg = 'NO_SIGHTINGS',
  loading,
}) {
  const [showMapView, setShowMapView] = useState(false);
  const theme = useTheme();
  const { regionOptions } = useOptions();
  const intl = useIntl();

  const mapModeClicked = () => setShowMapView(true);
  const listModeClicked = () => setShowMapView(false);

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
        cellRenderer: cellRendererTypes.specifiedTime,
      },
    },
    {
      reference: 'location',
      name: 'formattedLocation',
      label: 'Location',
      options: {
        cellRenderer: cellRendererTypes.location,
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

  const filteredColumns = allColumns?.filter(c =>
    columns.includes(c.reference),
  );

  const noSightings = sightings && sightings.length === 0;

  return (
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
              sightingsWithLocationData?.filter(entry =>
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
      {!showMapView && (
        <DataDisplay
          noTitleBar
          tableSize="medium"
          columns={filteredColumns}
          data={sightings}
          loading={loading}
          noResultsTextId={noSightingsMsg}
        />
      )}
      {!noSightings && showMapView && (
        <SightingMapView
          data={sightingsWithLocationData}
          linkPath={linkPath}
        />
      )}
    </Card>
  );
}
