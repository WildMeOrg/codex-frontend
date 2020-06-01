import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ButtonLink from '../../components/ButtonLink';
import Shell from './Shell';

export default function Logout() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'LOGGED_OUT' }));
  return (
    <Shell
      titleId="LOGGED_OUT"
      instructionsId="SUCCESSFULLY_LOGGED_OUT"
    >
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, width: 280 }}
      >
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            href="/login"
            style={{ width: '100%' }}
            color="secondary"
            variant="contained"
          >
            <FormattedMessage id="LOG_IN" />
          </ButtonLink>
        </Grid>
      </Grid>
    </Shell>
  );
}
