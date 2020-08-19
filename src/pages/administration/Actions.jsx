import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import BigExpansionPanel from '../../components/BigExpansionPanel';
import MainColumn from '../../components/MainColumn';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';

export default function AdminActions() {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [deleteUserEmail, setDeleteUserEmail] = useState('');
  const [deleteUsername, setDeleteUsername] = useState('');
  const [restoreEncounterId, setRestoreEncounterId] = useState('');
  return (
    <MainColumn>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <BigExpansionPanel>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="create-new-user-panel"
              id="create-new-user-panel-header"
            >
              <Typography variant="subtitle1">
                <FormattedMessage id="CREATE_NEW_USER" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
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
              <Typography>
                <FormattedMessage id="NEW_USER_ADMIN_MESSAGE" />
              </Typography>
              <div style={{ marginTop: 8 }}>
                <Button display="primary">
                  <FormattedMessage id="CREATE_ACCOUNT" />
                </Button>
              </div>
            </AccordionDetails>
          </BigExpansionPanel>
        </Grid>
        <Grid item>
          <BigExpansionPanel>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="delete-user-panel"
              id="delete-user-panel-header"
            >
              <Typography variant="subtitle1">
                <FormattedMessage id="DELETE_A_USER" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
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
              <Typography>
                <FormattedMessage id="DELETE_USER_INSTRUCTIONS" />
              </Typography>
              <div style={{ marginTop: 8 }}>
                <Button display="subtle">
                  <FormattedMessage id="DELETE_ACCOUNT" />
                </Button>
              </div>
            </AccordionDetails>
          </BigExpansionPanel>
        </Grid>

        <Grid item>
          <BigExpansionPanel>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="delete-user-panel"
              id="delete-user-panel-header"
            >
              <Typography variant="subtitle1">
                <FormattedMessage id="RESTORE_DELETED_ENCOUNTER" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{ display: 'flex', flexDirection: 'column' }}
            >
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
              <Typography>
                <FormattedMessage id="RESTORE_DELETED_ENCOUNTER_INSTRUCTIONS" />
              </Typography>
              <div style={{ marginTop: 8 }}>
                <Button display="primary">
                  <FormattedMessage id="RESTORE" />
                </Button>
              </div>
            </AccordionDetails>
          </BigExpansionPanel>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
