import React from 'react';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ResponsiveText from './ResponsiveText';

export default function SimpleFormPage({
  titleId,
  instructionsId,
  children,
}) {
  return (
    <div
      style={{
        paddingTop: 120,
        minHeight: '100vh',
      }}
    >
      <Paper
        style={{
          margin: '0px auto 200px',
          width: 360,
          maxWidth: '90%',
          position: 'relative',
          padding: '40px 16px 20px 16px',
        }}
      >
        <ResponsiveText variant="h2" style={{ paddingBottom: 8 }}>
          <FormattedMessage id={titleId} />
        </ResponsiveText>
        <Typography variant="subtitle2" style={{ maxWidth: 460 }}>
          <FormattedMessage id={instructionsId} />
        </Typography>
        {children}
      </Paper>
    </div>
  );
}
