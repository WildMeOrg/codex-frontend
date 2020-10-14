import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';

export default function AdminActions() {
  const intl = useIntl();
  useDocumentTitle(
    intl.formatMessage({ id: 'ADMINISTRATIVE_ACTIONS' }),
  );

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [deleteUserEmail, setDeleteUserEmail] = useState('');
  const [deleteUsername, setDeleteUsername] = useState('');
  const [restoreEncounterId, setRestoreEncounterId] = useState('');
  return (
    <MainColumn>
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        <FormattedMessage id="ADMINISTRATIVE_ACTIONS" />
      </Typography>
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ paddingBottom: 40 }}
      >
        <Grid item style={{ width: '100%' }}>
          <Typography
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
          >
            <FormattedMessage id="CREATE_NEW_USER" />
          </Typography>
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
            <Typography>
              <FormattedMessage id="NEW_USER_ADMIN_MESSAGE" />
            </Typography>
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
                value={newUserPassword}
                onChange={setNewUserPassword}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <Button display="primary">
                <FormattedMessage id="CREATE_ACCOUNT" />
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Typography
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
          >
            <FormattedMessage id="DELETE_A_USER" />
          </Typography>
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
            <Typography>
              <FormattedMessage id="DELETE_USER_INSTRUCTIONS" />
            </Typography>
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
          <Typography
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
          >
            <FormattedMessage id="RESTORE_DELETED_ENCOUNTER" />
          </Typography>
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
            <Typography>
              <FormattedMessage id="RESTORE_DELETED_ENCOUNTER_INSTRUCTIONS" />
            </Typography>
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
