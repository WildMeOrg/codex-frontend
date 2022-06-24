import React, { useState } from 'react';
import { get } from 'lodash-es';

import DialogActions from '@material-ui/core/DialogActions';

import Text from '../Text';
import Alert from '../Alert';
import Button from '../Button';
import StandardDialog from '../StandardDialog';
import PasswordVerificationAlert from '../PasswordVerificationAlert';
import useDeleteUser from '../../models/users/useDeleteUser';

export default function UserDeleteDialog({
  open,
  onClose,
  userData,
  deactivatingSelf = false,
}) {
  const [touched, setTouched] = useState(true);
  const [password, setPassword] = useState('');

  const { mutate: deleteUser, loading, error } = useDeleteUser();

  function cleanupAndClose() {
    setTouched(true);
    setPassword('');
    onClose();
  }

  async function processDeletion() {
    const success = await deleteUser({
      userGuid: userData?.guid,
      password,
    });
    if (success) {
      cleanupAndClose();
    }
  }

  const titleId = deactivatingSelf
    ? 'DEACTIVATE_ACCOUNT'
    : 'DEACTIVATE_USER';
  const confirmationId = deactivatingSelf
    ? 'DEACTIVATE_ACCOUNT_CONFIRMATION'
    : 'CONFIRM_USER_DEACTIVATION';
  const confirmationValues = deactivatingSelf
    ? undefined
    : {
        username: get(userData, 'full_name')
          ? get(userData, 'full_name')
          : get(userData, 'email'),
      };

  return (
    <StandardDialog
      open={open}
      onClose={cleanupAndClose}
      titleId={titleId}
      maxWidth="xs"
    >
      <div style={{ padding: '12px 24px' }}>
        <Text id={confirmationId} values={confirmationValues} />
        {touched ? (
          <PasswordVerificationAlert
            style={{ marginTop: 20 }}
            setPassword={setPassword}
            descriptionId="DEACTIVATION_SENSITIVE_ACTION_DESCRIPTION"
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
          id={titleId}
        />
      </DialogActions>
    </StandardDialog>
  );
}
