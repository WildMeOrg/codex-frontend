import React, { useState } from 'react';
import { get, flatten, omit } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';

import useAddAnnotationsToSightingEncounter from '../../../models/encounter/useAddAnnotationsToSightingEncounter';
import useAddAnnotationsToAGSEncounter from '../../../models/assetGroupSighting/useAddAnnotationsToAGSEncounter';
import StandardDialog from '../../../components/StandardDialog';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import Alert from '../../../components/Alert';
import AnnotatedPhotograph from '../../../components/AnnotatedPhotograph';

export default function AddAnnotationsDialog({
  sightingData,
  pending,
  encounter,
  onClose,
}) {
  const [selectedAnnotations, setSelectedAnnotations] = useState([]);

  const {
    mutate: addAnnotationsToSightingEncounter,
    error: addToSightingEncounterError,
    loading: addToSightingEncounterLoading,
    onClearError: onClearAddToSightingEncounterError,
  } = useAddAnnotationsToSightingEncounter();

  const {
    mutate: addAnnotationsToAGSEncounter,
    error: addToAGSEncounterError,
    loading: addToAGSEncounterLoading,
    onClearError: onClearAddToAGSEncounterError,
  } = useAddAnnotationsToAGSEncounter();

  const error = pending
    ? addToAGSEncounterError
    : addToSightingEncounterError;
  const loading = pending
    ? addToAGSEncounterLoading
    : addToSightingEncounterLoading;
  const onClearError = pending
    ? onClearAddToAGSEncounterError
    : onClearAddToSightingEncounterError;

  const encounterId = encounter?.guid;

  const open = Boolean(encounterId);
  const onCloseDialog = () => {
    setSelectedAnnotations([]);
    if (error) onClearError();
    onClose();
  };

  const sightingId = sightingData?.guid;
  const encounters = get(sightingData, 'encounters', []);
  const annotationsOnEncounters = flatten(
    encounters.map(enc => {
      const encAnnotations = get(enc, 'annotations', []);
      return encAnnotations.map(a => a?.guid);
    }),
  );

  const assets = get(sightingData, 'assets', []);
  const annotations = assets.reduce((acc, asset) => {
    const assetAnnotations = get(asset, 'annotations', []);
    const filteredAssetAnnotations = assetAnnotations.filter(
      a => !annotationsOnEncounters.includes(a?.guid),
    );
    const amendedAssetAnnotations = filteredAssetAnnotations.map(
      a => ({
        ...a,
        ...omit(asset, ['annotations', 'guid']),
      }),
    );
    return [...acc, ...amendedAssetAnnotations];
  }, []);

  return (
    <StandardDialog
      maxWidth="xl"
      titleId="ADD_ANNOTATIONS_TO_CLUSTER_TITLE"
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        <Grid container spacing={2}>
          {annotations.length === 0 && (
            <Text
              style={{ margin: '8px 0 20px 8px' }}
              variant="body2"
              id="NO_UNASSIGNED_ANNOTATIONS"
            />
          )}
          {annotations.map(annotation => {
            const annotationIsSelected = selectedAnnotations.includes(
              annotation?.guid,
            );
            return (
              <Grid item key={annotation?.guid}>
                <AnnotatedPhotograph
                  onClick={() => {
                    if (annotationIsSelected) {
                      setSelectedAnnotations(
                        selectedAnnotations.filter(
                          a => a !== annotation?.guid,
                        ),
                      );
                    } else {
                      setSelectedAnnotations([
                        ...selectedAnnotations,
                        annotation?.guid,
                      ]);
                    }
                  }}
                  annotations={[annotation]}
                  assetMetadata={annotation}
                  selectable
                  selected={annotationIsSelected}
                />
              </Grid>
            );
          })}
        </Grid>
        {error && (
          <Alert
            titleId="SERVER_ERROR"
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button display="basic" onClick={onCloseDialog} id="CLOSE" />
        <Button
          display="primary"
          disabled={selectedAnnotations.length === 0}
          loading={loading}
          onClick={async () => {
            let result;
            if (pending) {
              result = await addAnnotationsToAGSEncounter({
                agsGuid: sightingId,
                encounterGuid: encounterId,
                annotationGuids: selectedAnnotations,
              });
            } else {
              result = await addAnnotationsToSightingEncounter({
                sightingGuid: sightingId,
                encounterGuid: encounterId,
                annotationGuids: selectedAnnotations,
              });
            }
            if (result?.status === 200) onCloseDialog();
          }}
          id="ADD_ANNOTATIONS_TO_CLUSTER_BUTTON"
        />
      </DialogActions>
    </StandardDialog>
  );
}
