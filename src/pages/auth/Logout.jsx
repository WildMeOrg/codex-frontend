import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Shell from './Shell';

export default function Logout() {
  return (
    <Shell
      titleId="LOGGED_OUT"
      instructionsId="SUCCESSFULLY_LOGGED_OUT"
    >
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, width: 280 }}
      >
        <Grid item style={{ position: 'relative' }}>
          <Button
            onClick={() => {}}
            style={{ width: '100%' }}
            color="secondary"
            variant="contained"
          >
            <FormattedMessage id="LOG_IN" />
          </Button>
        </Grid>
      </Grid>
    </Shell>
  );
}
