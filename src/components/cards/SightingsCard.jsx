import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { get } from 'lodash-es';

import Text from '../Text';
import { formatDate } from '../../utils/formatters';
import useOptions from '../../pages/bulkImport/utils/useOptions';
import StandardDialog from '../StandardDialog';
import Button from '../Button';
import SightingInMap from '../../pages/sighting/SightingInMap';
import ActionIcon from '../ActionIcon';
import DataDisplay from '../dataDisplays/DataDisplay';
import Card from './Card';

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
  encounters,
  columns = ['date', 'location', 'actions'],
  onDelete,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [localLat, setLocalLat] = useState(null);
  const [localLng, setLocalLng] = useState(null);
  const onClose = () => setModalOpen(false);
  const theme = useTheme();
  const getAllColumns = () => [
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
      name: 'verbatimLocality',
      label: 'Location',
      options: {
        customBodyRender: (_, sightingObj) => {
          const { regionOptions } = useOptions();
          const currentSightingLocId = get(
            sightingObj,
            'locationId',
            '',
          );
          const currentLabel = regionOptions
            .filter(
              region =>
                get(region, 'value', '') === currentSightingLocId,
            )
            .map(regionObj => get(regionObj, 'label', ''))[0];
          const currentSightingVerbatimLoc = get(
            sightingObj,
            'verbatimLocality',
            '',
          );
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
          if (
            currentSightingLocId &&
            !currentSightingVerbatimLoc &&
            !currentSightingLat &&
            !currentSightingLong
          )
            return (
              currentLabel || (
                <FormattedMessage id="REGION_NAME_REMOVED" />
              )
            );

          if (
            !currentSightingLocId &&
            currentSightingVerbatimLoc &&
            !currentSightingLat &&
            !currentSightingLong
          )
            return currentSightingVerbatimLoc;
          if (
            !currentSightingLocId &&
            !currentSightingVerbatimLoc &&
            currentSightingLat &&
            currentSightingLong
          )
            return (
              <Button
                display="link"
                onClick={() => {
                  setLocalLat(currentSightingLat);
                  setLocalLng(currentSightingLong);
                  setModalOpen(true);
                }}
              >
                <FormattedMessage id="VIEW_ON_MAP" />
              </Button>
            );

          if (
            currentSightingLocId &&
            currentSightingVerbatimLoc &&
            !currentSightingLat &&
            !currentSightingLong
          ) {
            return currentLabel ? (
              currentLabel + ' (' + currentSightingVerbatimLoc + ')'
            ) : (
              <Text>
                <FormattedMessage id="REGION_NAME_REMOVED" />
                {' (' + currentSightingVerbatimLoc + ')'}
              </Text>
            );
          }
          if (
            currentSightingLocId &&
            currentSightingVerbatimLoc &&
            currentSightingLat &&
            currentSightingLong
          ) {
            const urlVal = currentLabel ? (
              currentLabel + ' (' + currentSightingVerbatimLoc + ')'
            ) : (
              <Text>
                <FormattedMessage id="REGION_NAME_REMOVED" />
                {' (' + currentSightingVerbatimLoc + ')'}
              </Text>
            );
            return (
              <Button
                display="link"
                onClick={() => {
                  setLocalLat(currentSightingLat);
                  setLocalLng(currentSightingLong);
                  setModalOpen(true);
                }}
              >
                {urlVal}
              </Button>
            );
          }
          return '';
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
              href={`/individuals/${value}`}
            />
            <ActionIcon
              labelId="REMOVE"
              variant="delete"
              onClick={() => onDelete(value)}
            />
          </div>
        ),
      },
    },
  ];

  const allColumns = getAllColumns(onDelete);
  const filteredColumns = allColumns.filter(c =>
    columns.includes(c.reference),
  );

  return (
    <div>
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="GPS_TITLE"
      >
        <DialogContent style={{ marginBottom: 24 }}>
          <SightingInMap latitude={localLat} longitude={localLng} />
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button
            id="CLOSE"
            display="basic"
            onClick={() => {
              onClose();
            }}
          />
        </DialogActions>
      </StandardDialog>
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
        {encounters && (
          <DataDisplay
            noTitleBar
            columns={filteredColumns}
            data={encounters}
          />
        )}
      </Card>
    </div>
  );
}
