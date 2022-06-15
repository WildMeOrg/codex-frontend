import React from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';

import useSiteSettings from '../../models/site/useSiteSettings';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import BaoParty from '../../components/svg/BaoParty';
import Text from '../../components/Text';

export default function EmailVerified() {
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;
  const { data: siteSettings } = useSiteSettings();
  const siteName = get(siteSettings, ['site.name', 'value'], '');
  useDocumentTitle('EMAIL_VERIFIED');

  console.log(siteSettings);

  return (
    <MainColumn
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
      }}
    >
      <Text
        variant="h4"
        component="h4"
        style={{ padding: '16px 0 8px 16px' }}
        id="WELCOME_TO_SITENAME"
        values={{ siteName }}
      />
      <BaoParty style={{ width: 280 }} themeColor={themeColor} />
      <Text
        variant="subtitle2"
        style={{ padding: '20px 8px 16px 8px', maxWidth: 400 }}
        id="EMAIL_VERIFIED_DESCRIPTION"
      />
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, maxWidth: 340 }}
      >
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{ width: '100%' }}
            display="primary"
            id="RETURN_HOME"
            href="/"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
