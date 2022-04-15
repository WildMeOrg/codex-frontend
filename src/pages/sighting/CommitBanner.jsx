import React, { useState } from 'react';
import { get, flatten } from 'lodash-es';
import { useQueryClient } from 'react-query';

import useGetAGS from '../../models/assetGroupSighting/useGetAGS';
import useCommitAssetGroupSighting from '../../models/assetGroupSighting/useCommitAssetGroupSighting';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import queryKeys, {
  getUserSightingsQueryKey,
} from '../../constants/queryKeys';
import useGetMe from '../../models/users/useGetMe';
import CommitDialog from './identification/CommitDialog';

const alertProps = {
  severity: 'info',
  style: { marginBottom: 24 },
};

export default function CommitBanner({
  sightingId,
  sightingData,
  pending,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: userData, loading: userInfoLoading } = useGetMe();
  const userId = get(userData, 'guid');
  const { isFetching: fetchingAGS } = useGetAGS(sightingId, !pending);

  const {
    mutate: commitAgs,
    isLoading: commitAgsLoading,
  } = useCommitAssetGroupSighting();

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
  const commitInProgress = commitAgsLoading || fetchingAGS;

  if (showCommitAlert) {
    return (
      <>
        <CommitDialog
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
              loading={commitInProgress}
              onClick={() => setDialogOpen(true)}
              // onClick={async () =>
              // {
              //   const results = await commitAgs({
              //     agsGuid: sightingId,
              //   });
              //   if (results?.status === 200)
              //   {
              //     queryClient.invalidateQueries(
              //       queryKeys.assetGroupSightings,
              //     );
              //     if (!userInfoLoading)
              //       queryClient.invalidateQueries(
              //         getUserSightingsQueryKey(userId),
              //       );
              //   }
              // }}
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
      {...alertProps}
    />
  );
}
