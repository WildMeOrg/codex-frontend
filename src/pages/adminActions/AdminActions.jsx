import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import Text from '../../components/Text';

export default function AdminActions() {
  useDocumentTitle('ADMINISTRATIVE_ACTIONS');

  const [restoreEncounterId, setRestoreEncounterId] = useState('');
  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="ADMINISTRATIVE_ACTIONS"
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
