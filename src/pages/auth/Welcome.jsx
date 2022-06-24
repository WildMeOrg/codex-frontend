import React from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../models/site/useSiteSettings';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';

export default function Welcome() {
  const { data: siteSettings } = useSiteSettings();
  const siteName = get(siteSettings, ['site.name', 'value'], '');
  useDocumentTitle('WELCOME');

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
      <Text
        variant="subtitle2"
        style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
        id="ACCOUNT_CREATION_SUCCESS"
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
            href="/"
            id="VIEW_HOMEPAGE"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{
              width: '100%',
            }}
            display="secondary"
            variant="contained"
            href="/report"
            id="REPORT_A_SIGHTING"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{
              width: '100%',
            }}
            display="tertiary"
            variant="contained"
            href="/individuals"
            id="EXPLORE_INDIVIDUALS"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
