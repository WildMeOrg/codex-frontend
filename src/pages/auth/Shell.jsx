import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';

export default function Shell({ titleId, instructionsId, children }) {
  return (
    <div
      style={{
        margin: '0px auto 200px',
        width: 300,
        maxWidth: 851,
        paddingTop: 120,
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 8px 16px' }}
      >
        <FormattedMessage id={titleId} />
      </Typography>
      <Typography
        variant="subtitle2"
        style={{ padding: '0 16px 8px 16px', maxWidth: 460 }}
      >
        <FormattedMessage id={instructionsId} />
      </Typography>
      {children}
    </div>
  );
}
