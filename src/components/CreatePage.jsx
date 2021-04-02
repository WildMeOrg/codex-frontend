import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import MainColumn from './MainColumn';
import Text from './Text';
import Button from './Button';

export default function CreatePage({ children, ctaId, onCreate }) {
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
          <Text id={ctaId} variant="h3" />
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
          <Button display="primary" onClick={onCreate}>
            <FormattedMessage id={ctaId} />
          </Button>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
