import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import ButtonLink from '../../components/ButtonLink';
import ResponsiveHeader from '../../components/ResponsiveHeader';

export default function HelpAsk() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        margin: '64px 0',
      }}
    >
      <ResponsiveHeader style={{ margin: '12px 0' }}>
        <FormattedMessage id="HOW_CAN_HELP" />
      </ResponsiveHeader>
      <Typography
        style={{
          maxWidth: 600,
          padding: '0px 20px',
          marginBottom: 32,
        }}
      >
        <FormattedMessage id="HOW_CAN_HELP_DESCRIPTIONS" />
      </Typography>
      <div>
        <ButtonLink
          display="primary"
          style={{
            margin: '12px 12px 0 12px',
          }}
          href="/report"
        >
          <FormattedMessage id="REPORT_SIGHTINGS" />
        </ButtonLink>
        <ButtonLink
          display="primary"
          style={{
            margin: '12px 12px 0 12px',
          }}
          href="https://www.wildme.org/donate/"
          external
        >
          <FormattedMessage id="MAKE_A_DONATION" />
        </ButtonLink>
      </div>
    </div>
  );
}
