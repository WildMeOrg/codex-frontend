import React, { useState } from 'react';
import { get, flatten } from 'lodash-es';

import Button from '../../components/Button';
import Alert from '../../components/Alert';
import CommitDialog from './identification/CommitDialog';

const alertProps = {
  severity: 'info',
  style: { marginBottom: 24 },
};

export default function CommitBanner({
  sightingId,
  sightingData,
  pending,
  setActiveTab,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!pending) return null;

  const assets = get(sightingData, 'assets', []);
  const encounters = get(sightingData, 'encounters', []);
  const annotationsOnAssets = flatten(
    assets.map(asset => get(asset, 'annotations')),
  );

  const annotationsOnEncounters = flatten(
    encounters.map(encounter => get(encounter, 'annotations')),
  );

  const allAnnotationsAssigned =
    annotationsOnAssets.length === annotationsOnEncounters.length;
  const detectionComplete = Boolean(
    sightingData?.curation_start_time,
  );
  const showCommitAlert = detectionComplete && allAnnotationsAssigned;

  if (showCommitAlert) {
    return (
      <>
        <CommitDialog
          agsGuid={sightingId}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
        <Alert
          titleId="SIGHTING_COMMIT_TITLE"
          descriptionId="SIGHTING_COMMIT_DESCRIPTION"
          action={
            <Button
              id="COMMIT"
              size="small"
              onClick={() => setDialogOpen(true)}
              style={{ marginTop: 8, marginRight: 4 }}
            />
          }
          {...alertProps}
        />
      </>
    );
  }

  return (
    <Alert
      titleId="NOT_READY_FOR_COMMIT"
      descriptionId="NOT_READY_FOR_COMMIT_DESCRIPTION"
      action={
        <Button
          id="ASSIGN"
          size="small"
          onClick={() => setActiveTab('#individuals')}
          style={{ marginTop: 8, marginRight: 4 }}
        />
      }
      {...alertProps}
    />
  );
}
