import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import CustomAlert from '../Alert';

import MainColumn from '../MainColumn';
import Text from '../Text';
import ButtonLink from '../ButtonLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function ReportSightingsPage({
  titleId,
  authenticated = false,
  children,
}) {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: titleId }));

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
          <Text variant="h3" id={titleId} />
        </Grid>
        {!authenticated && (
          <Grid item style={{ marginTop: 16 }}>
            <CustomAlert
              severity="info"
              titleId="REPORTING_ANONYMOUSLY"
              descriptionId="REPORTING_ANONYMOUSLY_WARNING"
              action={
                <ButtonLink
                  style={{ flexShrink: 0, marginRight: 8 }}
                  display="panel"
                  href="/login"
                >
                  <FormattedMessage id="LOG_IN" />
                </ButtonLink>
              }
            />
          </Grid>
        )}
        <Grid item container direction="column">
          {children}
        </Grid>
      </Grid>
    </MainColumn>
  );
}
