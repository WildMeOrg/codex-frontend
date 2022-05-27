import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import BaoWaving from '../../components/svg/BaoWaving';
import SiteSetupForm from './SiteSetupForm';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function SiteSetup() {
  useDocumentTitle('Welcome to Codex!', {
    appendSiteName: false,
    translateMessage: false,
  });
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  return (
    <MainColumn>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <BaoWaving
            style={{ width: 280, margin: '32px 24px 24px' }}
            themeColor={themeColor}
          />
        </Grid>
        <Grid item>
          <Text variant="h3" component="h3">
            Welcome to Codex!
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
