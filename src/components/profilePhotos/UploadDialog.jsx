import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import 'react-image-crop/dist/ReactCrop.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CustomAlert from '../Alert';

import usePatchUser from '../../models/users/usePatchUser';
import Button from '../Button';
import StandardDialog from '../StandardDialog';
import ProfileUploader from '../ProfileUploader';

export default function UploadDialog({ open, onClose, userId }) {
  const [profileAsset, setProfileAsset] = useState(null);

  const {
    replaceUserProperty,
    loading: replaceLoading,
    error: replaceError,
    setError: setReplaceError,
  } = usePatchUser(userId);

  async function submitProfilePhoto() {
    const successful = await replaceUserProperty(
      '/profile_fileupload_guid',
      profileAsset,
    );
    if (successful) onClose(true);
  }

  return (
    <StandardDialog
      open={open}
      onClose={() => {
        if (replaceError) setReplaceError(null);
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
        >
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
