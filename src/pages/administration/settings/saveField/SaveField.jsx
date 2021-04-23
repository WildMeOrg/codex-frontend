import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import MainColumn from '../../../../components/MainColumn';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';

export default function SaveField({ children, onSave }) {
  return (
    <MainColumn
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 1000,
      }}
    >
      <Grid container direction="column" style={{ padding: 32 }}>
        <Grid item>
          {/* <Text id={ctaId} variant="h3" /> */}
          <Text variant="h3">New Custom Field</Text>
        </Grid>
        <Grid item>
          <Paper
            elevation={2}
            style={{
              margin: '32px 0',
              padding: '0px 12px 20px 12px',
            }}
          >
            {children}
          </Paper>
        </Grid>
        <Grid item>
          <Button display="primary" onClick={onSave}>
            Save field
          </Button>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
