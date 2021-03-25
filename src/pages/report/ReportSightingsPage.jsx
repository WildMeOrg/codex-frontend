import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import ButtonLink from '../../components/ButtonLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function ReportSightingsPage({
  authenticated = false,
  children,
}) {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'REPORT_SIGHTINGS' }));

  return (
    <MainColumn
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 1000,
      }}
    >
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ padding: '20px 6vw' }}
      >
        <Grid item>
          <Text variant="h3" component="h3" id="REPORT_SIGHTINGS" />
        </Grid>
        {!authenticated && (
          <Grid item style={{ marginTop: 16 }}>
            <Alert
              severity="warning"
              action={
                <ButtonLink
                  style={{ flexShrink: 0, marginRight: 8 }}
                  display="panel"
                  href="/login"
                >
                  <FormattedMessage id="LOG_IN" />
                </ButtonLink>
              }
            >
              <AlertTitle>
                <FormattedMessage id="REPORTING_ANONYMOUSLY" />
              </AlertTitle>
              <FormattedMessage id="REPORTING_ANONYMOUSLY_WARNING" />
            </Alert>
          </Grid>
        )}
        <Grid item container direction="column">
          {children}
        </Grid>
      </Grid>
    </MainColumn>
  );
}
