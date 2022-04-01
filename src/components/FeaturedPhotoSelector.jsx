import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import CustomAlert from './Alert';
import usePatchSighting from '../models/sighting/usePatchSighting';
import Button from './Button';
import StandardDialog from './StandardDialog';
import usePatchIndividual from '../models/individual/usePatchIndividual';

export default function FeaturedPhotoSelector({
  open,
  onClose,
  assets,
  sightingId,
  individualId,
  currentFeaturedPhotoId,
  refreshData,
}) {
  const theme = useTheme();
  const [selectedPhoto, setSelectedPhoto] = useState(
    currentFeaturedPhotoId,
  );

  const {
    updateProperties,
    loading: sightingLoading,
    error: sightingError,
  } = usePatchSighting();
  const {
    updateIndividualProperties,
    loading: individualLoading,
    error: individualError,
  } = usePatchIndividual();

  const error = sightingError || individualError;

  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="SELECT_FEATURED_PHOTO"
    >
      <DialogContent>
        <div
          style={{
            display: 'grid',
            columnGap: 12,
            rowGap: 12,
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto',
            gridAutoRows: 'auto',
          }}
        >
          {assets.map(asset => (
            <input
              type="image"
              style={{
                border:
                  selectedPhoto === asset.guid
                    ? `8px solid ${theme.palette.primary.main}`
                    : 'unset',
                display: 'block',
                width: '100%',
              }}
              onClick={() => setSelectedPhoto(asset.guid)}
              alt={asset.altText}
              src={asset.src}
              key={asset.guid}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions
        style={{
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        {error && (
          <CustomAlert
            style={{ marginBottom: 20 }}
            severity="error"
            titleId="ERROR_UPDATING_PROFILE"
            description={error}
          />
        )}
        <Button
          display="primary"
          onClick={async () => {
            let successfulUpdate;
            if (sightingId) {
              successfulUpdate = await updateProperties(sightingId, {
                featuredAssetGuid: selectedPhoto,
              });
            } else {
              successfulUpdate = await updateIndividualProperties(
                individualId,
                {
                  featuredAssetGuid: selectedPhoto,
                },
              );
            }
            if (successfulUpdate) {
              refreshData();
              onClose();
            }
          }}
          autoFocus
          loading={sightingId ? sightingLoading : individualLoading}
          disabled={!selectedPhoto}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
