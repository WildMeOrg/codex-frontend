import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Button from '../../components/Button';

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
      <Typography
        variant="h3"
        component="h3"
        style={{ margin: '12px 0' }}
      >
        <FormattedMessage id="HOW_CAN_HELP" />
      </Typography>
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
        <Button
          display="primary"
          style={{
            marginTop: 12,
            marginRight: 12,
          }}
        >
          Adopt a whale shark
        </Button>
        <Button
          display="primary"
          style={{
            marginTop: 12,
            marginLeft: 12,
          }}
        >
          Make a donation
        </Button>
      </div>
    </div>
  );
}
