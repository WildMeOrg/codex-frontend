import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import Text from '../../components/Text';
import usePostUser from '../../models/users/usePostUser';
import UserEditTable from './UserEditTable';

export default function UserManagement() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'MANAGE_USERS' }));

  const {
    postUser,
    error,
    loading,
    setError,
    success,
    setSuccess,
  } = usePostUser();

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [deleteUserEmail, setDeleteUserEmail] = useState('');
  const [deleteUsername, setDeleteUsername] = useState('');
  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="MANAGE_USERS"
      />
      <ButtonLink
        href="/admin"
        style={{ marginTop: 8, width: 'fit-content' }}
        display="back"
        id="BACK"
      />
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ paddingBottom: 40 }}
      >
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="CREATE_NEW_USER"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              id="NEW_USER_ADMIN_MESSAGE"
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex' }}>
              <LabeledInput
                style={{ marginRight: 12 }}
                schema={{
                  labelId: 'EMAIL_ADDRESS',
                  displayType: 'string',
                }}
                value={newUserEmail}
                onChange={setNewUserEmail}
              />
              <LabeledInput
                style={{ marginLeft: 12 }}
                schema={{
                  labelId: 'PASSWORD',
                  displayType: 'string',
                }}
                type="password"
                value={newUserPassword}
                onChange={setNewUserPassword}
              />
            </div>
            {Boolean(error) && (
              <CustomAlert
                onClose={() => setError(null)}
                severity="error"
                titleId="SUBMISSION_ERROR"
                description={error}
              />
            )}
            {Boolean(success) && (
              <CustomAlert
                onClose={() => setSuccess(null)}
                severity="success"
                titleId="USER_CREATED_SUCCESSFULLY"
                description={success}
              />
            )}
            <div style={{ marginTop: 8 }}>
              <Button
                display="primary"
                loading={loading}
                onClick={async () => {
                  const successful = await postUser(
                    newUserEmail,
                    newUserPassword,
                  );
                  if (successful) {
                    setNewUserEmail('');
                    setNewUserPassword('');
                  }
                }}
              >
                <FormattedMessage id="CREATE_ACCOUNT" />
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="EDIT_USERS"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <UserEditTable />
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
