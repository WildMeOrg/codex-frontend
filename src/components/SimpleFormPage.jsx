import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Text from './Text';

export default function SimpleFormPage({
  titleId,
  titleIntlValues,
  instructionsId,
  BaoComponent,
  baoStyles = {},
  children,
}) {
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  return (
    <div
      style={{
        paddingTop: '20vh',
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <div style={{ margin: '0px 80px 0 20px' }}>
        <Text
          responsive
          variant="h2"
          style={{ paddingBottom: 32 }}
          id={titleId}
          values={titleIntlValues}
        />
        {BaoComponent && (
          <BaoComponent
            style={{ width: 280, ...baoStyles }}
            themeColor={themeColor}
          />
        )}
      </div>
      <Paper
        style={{
          width: 360,
          marginTop: 24,
          maxWidth: '90%',
          position: 'relative',
          padding: '12px 16px 20px 16px',
          height: 'min-content',
        }}
      >
        <Text
          style={{ maxWidth: 460, fontWeight: 'bold', marginLeft: 4 }}
          id={instructionsId}
        />
        {children}
      </Paper>
    </div>
  );
}
