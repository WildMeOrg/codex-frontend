import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function NoPhotoReport() {
  return (
    <>
      <Grid item>
        <Typography variant="h3" component="h3">
          <FormattedMessage id="BULK_UPLOAD" />
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          <FormattedMessage id="PHOTO_RIGHTS" />
        </Typography>
      </Grid>
    </>
  );
}
