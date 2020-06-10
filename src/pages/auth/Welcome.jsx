import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
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
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 8px 16px' }}
      >
        <FormattedMessage
          id="WELCOME_TO_SITENAME"
          values={{ siteName }}
        />
      </Typography>
      <Typography
        variant="body1"
        style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
      >
        <FormattedMessage id="ACCOUNT_CREATION_SUCCESS" />
      </Typography>
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, width: 280 }}
      >
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{ width: '100%' }}
            color="secondary"
            variant="contained"
            href="/"
          >
            <FormattedMessage id="VIEW_HOME" />
          </ButtonLink>
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{
              width: '100%',
              backgroundColor: 'rgb(79, 84, 255)',
              color: 'white',
            }}
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
              backgroundColor: 'rgb(232, 85, 0)',
              color: 'white',
            }}
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
