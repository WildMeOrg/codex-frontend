import React, { useState } from 'react';
import { get, omit } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';

import StandardDialog from '../../../components/StandardDialog';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import AnnotatedPhotograph from '../../../components/AnnotatedPhotograph';

export default function AddAnnotationsDialog({
  encounterId,
  onClose,
  sightingData,
}) {
  const [selectedAnnotations, setSelectedAnnotations] = useState([]);
  const open = Boolean(encounterId);
  const onCloseDialog = () => {
    setSelectedAnnotations([]);
    onClose();
  };

  const error = 'sup';

  const assets = get(sightingData, 'assets', []);
  const annotations = assets.reduce((acc, asset) => {
    const assetAnnotations = get(asset, 'annotations', []);
    const amendedAssetAnnotations = assetAnnotations.map(a => ({
      ...a,
      ...omit(asset, ['annotations', 'guid']),
    }));
    return [...acc, ...amendedAssetAnnotations];
  }, []);

  console.log(selectedAnnotations);

  return (
    <StandardDialog
      maxWidth="xl"
      titleId="ADD_ANNOTATIONS_TO_CLUSTER_TITLE"
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        <Grid container spacing={2}>
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
        {/* {error && (
          <Alert
            titleId="SERVER_ERROR"
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
          >
            {error}
          </Alert>
        )} */}
      </DialogContent>
      <DialogActions>
        <Button display="basic" onClick={onCloseDialog} id="CLOSE" />
        <Button
          display="primary"
          disabled={false}
          loading={false}
          onClick={async () => {
            console.log('result');
          }}
          id="ADD_ANNOTATIONS_TO_CLUSTER_BUTTON"
        />
      </DialogActions>
    </StandardDialog>
  );
}
