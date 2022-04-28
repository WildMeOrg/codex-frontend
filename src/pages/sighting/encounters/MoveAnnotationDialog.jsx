import React, { useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import useAddAnnotationsToSightingEncounter from '../../../models/encounter/useAddAnnotationsToSightingEncounter';
import useAddAnnotationsToAGSEncounter from '../../../models/assetGroupSighting/useAddAnnotationsToAGSEncounter';
import StandardDialog from '../../../components/StandardDialog';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import Alert from '../../../components/Alert';
import AnnotatedPhotograph from '../../../components/AnnotatedPhotograph';

export default function MoveAnnotationDialog({
  open,
  sightingData,
  pending,
  annotation,
  onClose,
}) {
  const [selectedEncounter, setSelectedEncounter] = useState('');

  const assets = get(sightingData, 'assets', []);

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

  const onCloseDialog = () => {
    setSelectedEncounter('');
    if (error) onClearError();
    onClose();
  };

  const sightingId = sightingData?.guid;
  const encounters = get(sightingData, 'encounters', []);

  const selectedEncounterAnnotations = get(
    selectedEncounter,
    'annotations',
    [],
  );
  const noAnnotations =
    selectedEncounter && selectedEncounterAnnotations.length === 0;

  const showSelect = encounters.length > 1;

  return (
    <StandardDialog
      titleId="MOVE_ANNOTATION_TO_ANOTHER_CLUSTER"
      open={open}
      onClose={onCloseDialog}
      PaperProps={{
        style: {
          width: 636,
          maxWidth: '80vw',
          height: 420,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent>
        {showSelect ? (
          <FormControl style={{ width: 240 }}>
            <InputLabel>
              <FormattedMessage id="SELECT_NEW_CLUSTER" />
            </InputLabel>
            <Select
              labelId="move-encounter-selector-label"
              id="move-encounter-selector"
              value={selectedEncounter}
              onChange={e => setSelectedEncounter(e.target.value)}
            >
              {encounters.map((encounter, i) => {
                const encounterAnnotations = get(
                  encounter,
                  'annotations',
                  [],
                );
                const exclude = encounterAnnotations.find(
                  a => a?.guid === annotation?.guid,
                );
                if (exclude) return null;
                return (
                  <MenuItem key={encounter?.guid} value={encounter}>
                    <FormattedMessage
                      id="ANIMAL_CLUSTER_LABEL"
                      values={{ i: i + 1 }}
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ) : (
          <Text
            style={{ margin: '8px 0 20px 8px' }}
            variant="body2"
            id="NO_DESTINATION_CLUSTERS"
          />
        )}
        <Grid container spacing={2} style={{ margin: '20px 0' }}>
          {selectedEncounterAnnotations.map(a => {
            const assetGuid = a?.asset_guid;
            const matchingAsset = assets.find(
              asset => asset?.guid === assetGuid,
            );
            const annotationWithData = get(
              matchingAsset,
              'annotations',
              [],
            ).find(annot => annot?.guid === a?.guid);

            return (
              <Grid item key={a?.guid}>
                <AnnotatedPhotograph
                  annotations={[annotationWithData]}
                  assetMetadata={matchingAsset}
                  width={180}
                />
              </Grid>
            );
          })}
          {noAnnotations && <Text id="NO_ANNOTATIONS_IN_CLUSTER" />}
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
          disabled={!selectedEncounter}
          loading={loading}
          onClick={async () => {
            let result;
            if (pending) {
              result = await addAnnotationsToAGSEncounter({
                agsGuid: sightingId,
                encounterGuid: selectedEncounter?.guid,
                annotationGuids: [annotation?.guid],
              });
            } else {
              result = await addAnnotationsToSightingEncounter({
                sightingGuid: sightingId,
                encounterGuid: selectedEncounter?.guid,
                annotationGuids: [annotation?.guid],
              });
            }
            if (result?.status === 200) onCloseDialog();
          }}
          id="MOVE_ANNOTATION"
        />
      </DialogActions>
    </StandardDialog>
  );
}
