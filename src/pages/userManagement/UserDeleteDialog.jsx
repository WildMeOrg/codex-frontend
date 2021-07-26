import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogActions from '@material-ui/core/DialogActions';
import Text from '../../components/Text';

import Alert from '../../components/Alert';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';
import PasswordVerificationAlert from '../../components/PasswordVerificationAlert';
import useDeleteUser from '../../models/users/useDeleteUser';

export default function UserDeleteDialog({
  open,
  onClose,
  userData,
  refreshUserData,
}) {
  const [touched, setTouched] = useState(true);
  const [password, setPassword] = useState('');

  const { deleteUser, loading, error } = useDeleteUser();

  function cleanupAndClose() {
    setTouched(true);
    setPassword('');
    onClose();
  }

  async function processDeletion() {
    const success = await deleteUser(get(userData, 'guid'), password);
    if (success) {
      refreshUserData();
      cleanupAndClose();
    }
  }

  return (
    <StandardDialog
      open={open}
      onClose={cleanupAndClose}
      titleId="DELETE_USER"
      maxWidth="xs"
    >
      <div style={{ padding: '12px 24px' }}>
        <Text
          id="CONFIRM_DELETE_USER"
          values={{
            username: get(userData, 'full_name')
              ? get(userData, 'full_name')
              : get(userData, 'email'),
          }}
        />
        {touched ? (
          <PasswordVerificationAlert
            setPassword={setPassword}
            descriptionId="SENSITIVE_USER_DATA_CHANGE_DESCRIPTION"
          />
        ) : null}
        {error && (
          <Alert severity="error" titleId="SERVER_ERROR">
            {error}
          </Alert>
        )}
      </div>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="primary"
          onClick={processDeletion}
          loading={loading}
        >
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
