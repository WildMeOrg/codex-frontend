import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import CustomAlert from '../../../components/Alert';
import usePatchSighting from '../../../models/sighting/usePatchSighting';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';

export default function FeaturedPhotoSelector({
  open,
  onClose,
  assets,
  sightingId = null,
  individualId = null,
  currentFeaturedPhotoId,
  // refreshSightingData,
}) {
  const theme = useTheme();
  const [selectedPhoto, setSelectedPhoto] = useState(
    currentFeaturedPhotoId,
  );

  const { updateProperties, loading, error } = usePatchSighting();
  //TODO update individualProperties accommodate

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
              alt={asset.filename}
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
            const successfulUpdate = await updateProperties(
              sightingId,
              { featuredAssetGuid: selectedPhoto },
            );
            if (successfulUpdate) {
              // refreshSightingData();
              onClose();
            }
          }}
          autoFocus
          loading={loading}
          disabled={!selectedPhoto}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
