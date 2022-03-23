import React, { useState } from 'react';

import 'react-image-crop/dist/ReactCrop.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CustomAlert from '../Alert';

import { useReplaceUserProperty } from '../../models/users/usePatchUser';
import Button from '../Button';
import StandardDialog from '../StandardDialog';
import ProfileUploader from '../ProfileUploader';

export default function UploadDialog({ open, onClose, userId }) {
  const [profileAsset, setProfileAsset] = useState(null);

  const {
    mutate: replaceUserProperty,
    loading: replaceLoading,
    error: replaceError,
    clearError: clearReplaceError,
  } = useReplaceUserProperty();

  async function submitProfilePhoto() {
    const successful = await replaceUserProperty({
      userGuid: userId,
      path: '/profile_fileupload_guid',
      value: profileAsset,
    });
    if (successful) onClose(true);
  }

  return (
    <StandardDialog
      open={open}
      onClose={() => {
        if (replaceError) clearReplaceError();
        onClose(false);
      }}
      titleId="CHOOSE_PHOTO"
    >
      <DialogContent>
        <ProfileUploader onComplete={setProfileAsset} />
        {replaceError && (
          <CustomAlert
            style={{ marginTop: 20 }}
            severity="error"
            titleId="ERROR_UPDATING_PROFILE"
            description={replaceError}
          />
        )}
      </DialogContent>
      <DialogActions
        style={{ marginTop: 32, padding: '0px 24px 24px 24px' }}
      >
        <Button
          display="primary"
          onClick={submitProfilePhoto}
          autoFocus
          disabled={!profileAsset}
          loading={replaceLoading}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
