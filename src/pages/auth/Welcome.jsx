import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';
import { selectSiteName } from '../../modules/site/selectors';

export default function Welcome() {
  const siteName = useSelector(selectSiteName);
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'WELCOME' }));

  return (
    <MainColumn
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
      }}
    >
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 8px 16px' }}
        id="WELCOME_TO_SITENAME"
        values={{ siteName }}
      />
      <Text
        variant="body1"
        style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
        id="ACCOUNT_CREATION_SUCCESS"
      />
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, width: 280 }}
      >
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{ width: '100%' }}
            display="primary"
            href="/"
          >
            <FormattedMessage id="VIEW_HOMEPAGE" />
          </ButtonLink>
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{
              width: '100%',
            }}
            display="secondary"
            variant="contained"
            href="/report"
          >
            <FormattedMessage id="REPORT_A_SIGHTING" />
          </ButtonLink>
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{
              width: '100%',
            }}
            display="tertiary"
            variant="contained"
            href="/individuals"
          >
            <FormattedMessage id="EXPLORE_INDIVIDUALS" />
          </ButtonLink>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
