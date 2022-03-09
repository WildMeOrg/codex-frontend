import React, { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';

import { formatLocationFromSighting } from '../../utils/formatters';
import useOptions from '../../hooks/useOptions';
import { cellRendererTypes } from '../dataDisplays/cellRenderers';
import Text from '../Text';
import ActionIcon from '../ActionIcon';
import DataDisplay from '../dataDisplays/DataDisplay';
import Card from './Card';
import ConfirmDelete from '../ConfirmDelete';
import useDeleteEncounter from '../../models/encounter/useDeleteEncounter';

/* While this displays an array of encounters, the card will often be 
"sightings of __individual_name__" or something like that. */
export default function EncountersCard({
  individualName = null,
  title,
  titleId = 'SIGHTINGS',
  encounters,
  columns = ['date', 'location', 'owner', 'actions'],
  noDataMessage = 'NO_SIGHTINGS',
}) {
  const [showMapView, setShowMapView] = useState(false);
  const [
    showEncounterDeleteDialog,
    setShowEncounterDeleteDialog,
  ] = useState({ display: false, endId: null });
  const theme = useTheme();
  const { regionOptions } = useOptions();
  const intl = useIntl();

  const mapModeClicked = () => setShowMapView(true);
  const listModeClicked = () => setShowMapView(false);
  const {
    deleteEncounter,
    loading: deleteEncounterLoading,
    error: deleteEncounterError,
    onClearError: deleteEncounterOnClearError,
  } = useDeleteEncounter();

  const encountersWithLocationData = useMemo(
    () => {
      // hotfix //
      if (!encounters) return [];
      // hotfix //

      return encounters.map(encounter => ({
        ...encounter,
        formattedLocation: formatLocationFromSighting(
          encounter,
          regionOptions,
          intl,
        ),
      }));
    },
    [get(encounters, 'length')],
  );

  const onCloseConfirmDelete = () => {
    deleteEncounterOnClearError();
    setShowEncounterDeleteDialog({ display: false, endId: null });
  };

  const allColumns = [
    {
      reference: 'date',
      name: 'time',
      label: 'Date',
      options: { cellRenderer: cellRendererTypes.specifiedTime },
    },
    {
      reference: 'location',
      name: 'formattedLocation',
      label: 'Location',
      options: { cellRenderer: cellRendererTypes.location },
    },
    {
      reference: 'owner',
      name: 'owner',
      label: 'Owner',
      options: { cellRenderer: cellRendererTypes.user },
    },
    {
      reference: 'actions',
      name: 'guid',
      label: 'Actions',
      options: {
        customBodyRender: (_, encounter) => [
          <ActionIcon
            variant="view"
            href={`/sightings/${encounter?.sighting}`}
          />,
          <ActionIcon
            variant="delete"
            onClick={() =>
              setShowEncounterDeleteDialog({
                display: true,
                encId: encounter?.guid,
              })
            }
          />,
        ],
      },
    },
  ];

  const filteredColumns = allColumns.filter(c =>
    columns.includes(c.reference),
  );

  const noEncounters = encounters && encounters.length === 0;

  return [
    <ConfirmDelete
      open={Boolean(showEncounterDeleteDialog.display)}
      onClose={onCloseConfirmDelete}
      title={<FormattedMessage id="REMOVE_CATEGORY" />}
      messageId={intl.formatMessage(
        { id: 'ENCOUNTER_DELETE_FROM_INDIVIDUAL_MESSAGE' },
        { individual_name: individualName },
      )}
      onDelete={async () => {
        let successful = await deleteEncounter(
          showEncounterDeleteDialog.encId,
        );
      }}
      deleteInProgress={deleteEncounterLoading}
      error={deleteEncounterError}
    />,
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
              encountersWithLocationData.filter(entry =>
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
      {noEncounters && (
        <Text
          variant="body2"
          id={noDataMessage}
          style={{ marginTop: 12 }}
        />
      )}
      {!noEncounters && !showMapView && (
        <DataDisplay
          noTitleBar
          tableSize="medium"
          columns={filteredColumns}
          data={encountersWithLocationData}
        />
      )}
      {!noEncounters && showMapView && <div>Map goes here</div>}
    </Card>,
  ];
}
