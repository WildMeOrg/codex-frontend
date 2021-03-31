import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import 'react-image-crop/dist/ReactCrop.css';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import usePatchUser from '../../models/users/usePatchUser';
import Button from '../Button';
import StandardDialog from '../StandardDialog';
import ProfileUploader from '../ProfileUploader';

export default function UploadDialog({ open, onClose }) {
  const [profileAsset, setProfileAsset] = useState(null);

  const {
    replaceUserProperty,
    loading: replaceLoading,
    error: replaceError,
    setError: setReplaceError,
  } = usePatchUser('5d9ac656-426b-40bf-a7a1-99ffe52f8786');

  async function submitProfilePhoto() {
    const successful = await replaceUserProperty(
      '/profile_fileupload_guid',
      profileAsset,
    );
    if (successful) onClose();
  }

  return (
    <StandardDialog
      open={open}
      onClose={() => {
        if (replaceError) setReplaceError(null);
        onClose();
      }}
      titleId="CHOOSE_PHOTO"
    >
      <DialogContent>
        <ProfileUploader onComplete={setProfileAsset} />
        {replaceError && (
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="ERROR_UPDATING_PROFILE" />
            </AlertTitle>
            {replaceError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions
        style={{ marginTop: 32, padding: '0px 24px 24px 24px' }}
      >
        <Button
          display="primary"
          onClick={submitProfilePhoto}
          autoFocus
          loading={replaceLoading}
        >
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
