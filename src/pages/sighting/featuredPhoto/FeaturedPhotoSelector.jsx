import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';

export default function FeaturedPhotoSelector({
  open,
  onClose,
  assets,
  currentFeaturedPhotoId,
}) {
  const theme = useTheme();
  const [selectedPhoto, setSelectedPhoto] = useState(
    currentFeaturedPhotoId,
  );

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
                    ? `8px solid ${theme.palette.success.main}`
                    : 'unset',
                display: 'block',
                width: '100%',
              }}
              onClick={() => setSelectedPhoto(asset.guid)}
              alt={asset.filename}
              src={asset.src}
            />
          ))}
        </div>
        {false && (
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="ERROR_UPDATING_PROFILE" />
            </AlertTitle>
            Error goes here
          </Alert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '12px 24px' }}>
        <Button
          display="primary"
          onClick={onClose}
          autoFocus
          // loading={replaceLoading}
          disabled={!selectedPhoto}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
