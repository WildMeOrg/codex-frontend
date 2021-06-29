import React from 'react';
import Grid from '@material-ui/core/Grid';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
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
          <Text variant="h3" component="h3">
            Welcome to Code Cave!
          </Text>
        </Grid>
        <Grid item>
          <Text variant="subtitle1">
            Time to configure your new site.
          </Text>
        </Grid>
      </Grid>
      <SiteSetupForm primaryButtonId="FINISH_SETUP" />
    </MainColumn>
  );
}
