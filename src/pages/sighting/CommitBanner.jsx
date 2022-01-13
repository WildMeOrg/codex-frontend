import React from 'react';
import { get, flatten, every } from 'lodash-es';

import useCommitAssetGroupSighting from '../../models/assetGroupSighting/useCommitAssetGroupSighting';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const alertProps = {
  severity: 'info',
  style: { marginBottom: 24 },
};

export default function CommitBanner({
  sightingId,
  sightingData,
  pending,
}) {
  const {
    commitAgs,
    isLoading: commitAgsLoading,
  } = useCommitAssetGroupSighting();

  if (!pending) return null;

  const assets = get(sightingData, 'assets', []);
  const annotations = flatten(
    assets.map(asset => get(asset, 'annotations')),
  );

  const allAnnotationsAssigned = every(annotations, 'encounter_guid');
  const detectionComplete = Boolean(
    sightingData?.curation_start_time,
  );
  const showCommitAlert = detectionComplete && allAnnotationsAssigned;

  if (showCommitAlert) {
    return (
      <Alert
        titleId="SIGHTING_COMMIT_TITLE"
        descriptionId="SIGHTING_COMMIT_DESCRIPTION"
        action={
          <Button
            id="COMMIT"
            size="small"
            loading={commitAgsLoading}
            onClick={() => commitAgs(sightingId)}
            style={{ marginTop: 8, marginRight: 4 }}
          />
        }
        {...alertProps}
      />
    );
  }

  return (
    <Alert
      titleId="NOT_READY_FOR_COMMIT"
      descriptionId="NOT_READY_FOR_COMMIT_DESCRIPTION"
      {...alertProps}
    />
  );
}
