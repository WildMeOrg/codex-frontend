import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';

export default function Actions() {
  return (
    <div style={{ margin: 12 }}>
      <Text variant="subtitle1" id="ACTIONS" />

      <Grid container spacing={1}>
        <Grid style={{ margin: 4 }} item>
          <ButtonLink href="/report">
            <FormattedMessage id="REPORT_SIGHTINGS" />
          </ButtonLink>
        </Grid>
        <Grid style={{ margin: 4 }} item>
          <ButtonLink href="/users/bob">
            <FormattedMessage id="VIEW_PUBLIC_PROFILE" />
          </ButtonLink>
        </Grid>
      </Grid>
    </div>
  );
}
