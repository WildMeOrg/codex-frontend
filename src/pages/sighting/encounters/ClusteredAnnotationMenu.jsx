import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ConfirmDelete from '../../../components/ConfirmDelete';
import useRemoveAnnotationsFromAGSEncounter from '../../../models/assetGroupSighting/useRemoveAnnotationsFromAGSEncounter';
import useRemoveAnnotationsFromSightingEncounter from '../../../models/encounter/useRemoveAnnotationsFromSightingEncounter';

export default function ClusteredAnnotationMenu({
  id,
  anchorEl,
  open,
  onClose,
  annotation,
  sightingId,
  pending,
}) {
  const [annotationToRemove, setAnnotationToRemove] = useState(null);

  const {
    removeAnnotationsFromAgsEncounter,
    isLoading: removeAnnotationsFromAGSEncounterLoading,
    error: removeAnnotationsFromAGSEncounterError,
    onClearError: clearRemoveAnnotationsFromAGSEncounterError,
  } = useRemoveAnnotationsFromAGSEncounter();

  const {
    removeAnnotationsFromSightingEncounter,
    isLoading: removeAnnotationFromSightingEncounterLoading,
    error: removeAnnotationFromSightingEncounterError,
    onClearError: clearRemoveAnnotationsFromSightingEncounterError,
  } = useRemoveAnnotationsFromSightingEncounter();

  const removeAnnotationsLoading = pending
    ? removeAnnotationsFromAGSEncounterLoading
    : removeAnnotationFromSightingEncounterLoading;
  const removeAnnotationsError = pending
    ? removeAnnotationsFromAGSEncounterError
    : removeAnnotationFromSightingEncounterError;
  const clearRemoveAnnotationsError = pending
    ? clearRemoveAnnotationsFromAGSEncounterError
    : clearRemoveAnnotationsFromSightingEncounterError;

  console.log(annotationToRemove);

  return (
    <Menu id={id} anchorEl={anchorEl} open={open} onClose={onClose}>
      <ConfirmDelete
        open={Boolean(annotationToRemove)}
        titleId="REMOVE_ANNOTATION_FROM_CLUSTER"
        messageId="REMOVE_ANNOTATION_FROM_CLUSTER_CONFIRMATION"
        onClose={() => {
          if (removeAnnotationsError) clearRemoveAnnotationsError();
          setAnnotationToRemove(null);
        }}
        error={removeAnnotationsError}
        deleteInProgress={removeAnnotationsLoading}
        onDelete={async () => {
          let result;
          if (pending) {
            result = await removeAnnotationsFromAgsEncounter(
              sightingId,
              annotation?.encounter_guid,
              [annotation?.guid],
            );
          } else {
            result = await removeAnnotationsFromSightingEncounter(
              annotation?.encounter_guid,
              [annotation?.guid],
            );
          }
          return result;
        }}
      />
      <MenuItem onClick={() => setAnnotationToRemove(annotation)}>
        <FormattedMessage id="REMOVE_FROM_CLUSTER" />
      </MenuItem>
    </Menu>
  );
}
