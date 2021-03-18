import React from 'react';
import Paper from '@material-ui/core/Paper';
import Text from './Text';

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
          margin: '0px auto 120px',
          width: 360,
          maxWidth: '90%',
          position: 'relative',
          padding: '40px 16px 20px 16px',
        }}
      >
        <Text
          responsive
          variant="h2"
          style={{ paddingBottom: 8 }}
          id={titleId}
        />
        <Text
          variant="subtitle2"
          style={{ maxWidth: 460 }}
          id={instructionsId}
        />
        {children}
      </Paper>
    </div>
  );
}
