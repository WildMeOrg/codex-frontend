import React from 'react';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CustomAlert from '../Alert';

import usePatchUser from '../../models/users/usePatchUser';
import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Button from '../Button';

export default function RemoveDialog({ open, onClose, userId }) {
  const {
    removeUserProperty,
    loading,
    error,
    setError,
  } = usePatchUser(userId);

  const onCloseDialog = () => {
    if (error) setError(null);
    onClose();
  };

  async function removeProfilePhoto() {
    const successful = await removeUserProperty(
      '/profile_fileupload_guid',
    );
    if (successful) onCloseDialog();
  }

  return (
    <StandardDialog
      open={open}
      onClose={onCloseDialog}
      titleId="CONFIRM_DELETE"
    >
      <DialogContent>
        <Text id="CONFIRM_REMOVE_PROFILE_PICTURE" />
        {error && (
          <CustomAlert
            severity="error"
            titleId="SERVER_ERROR"
            description={error}
          />
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onCloseDialog}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          loading={loading}
          display="primary"
          onClick={removeProfilePhoto}
        >
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
