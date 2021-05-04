import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import Text from '../../components/Text';
import usePostUser from '../../models/users/usePostUser';

export default function AdminActions() {
  const intl = useIntl();
  useDocumentTitle(
    intl.formatMessage({ id: 'ADMINISTRATIVE_ACTIONS' }),
  );

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
  const [restoreEncounterId, setRestoreEncounterId] = useState('');
  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="ADMINISTRATIVE_ACTIONS"
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
              <Alert onClose={() => setError(null)} severity="error">
                <AlertTitle>
                  <FormattedMessage id="SUBMISSION_ERROR" />
                </AlertTitle>
                {error}
              </Alert>
            )}
            {Boolean(success) && (
              <Alert
                onClose={() => setSuccess(null)}
                severity="success"
              >
                <AlertTitle>
                  <FormattedMessage id="USER_CREATED_SUCCESSFULLY" />
                </AlertTitle>
                {success}
              </Alert>
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
            id="DELETE_A_USER"
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
            <Text id="DELETE_USER_INSTRUCTIONS" />
            <div style={{ display: 'flex' }}>
              <LabeledInput
                style={{ marginRight: 12 }}
                schema={{
                  labelId: 'EMAIL_ADDRESS',
                  displayType: 'string',
                }}
                value={deleteUserEmail}
                onChange={setDeleteUserEmail}
              />
              <LabeledInput
                style={{ marginLeft: 12 }}
                schema={{
                  labelId: 'USERNAME',
                  displayType: 'string',
                }}
                value={deleteUsername}
                onChange={setDeleteUsername}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <Button
                display="subtle"
                style={{ backgroundColor: '#ff171b', color: 'white' }}
              >
                <FormattedMessage id="DELETE_ACCOUNT" />
              </Button>
            </div>
          </Paper>
        </Grid>

        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="RESTORE_DELETED_ENCOUNTER"
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
            <Text id="RESTORE_DELETED_ENCOUNTER_INSTRUCTIONS" />
            <div style={{ display: 'flex' }}>
              <LabeledInput
                schema={{
                  labelId: 'ENCOUNTER_ID',
                  displayType: 'string',
                }}
                value={restoreEncounterId}
                onChange={setRestoreEncounterId}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <Button display="primary">
                <FormattedMessage id="RESTORE_ENCOUNTER" />
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
