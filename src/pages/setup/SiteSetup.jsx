import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../components/MainColumn';
import newSiteImage from '../../assets/newsite.png';
import SiteSetupForm from './SiteSetupForm';

export default function SiteSetup() {
  return (
    <MainColumn>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <img
            style={{ margin: 50 }}
            alt="new site graphic"
            src={newSiteImage}
          />
        </Grid>
        <Grid item>
          <Typography variant="h3" component="h3">
            Welcome to Codex!
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            Time to configure your new site.
          </Typography>
        </Grid>
      </Grid>
      <SiteSetupForm primaryButtonId="FINISH_SETUP" />
    </MainColumn>
  );
}
