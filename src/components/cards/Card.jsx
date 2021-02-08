import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Text from '../Text';

export default function Card({
  title,
  titleId,
  renderActions,
  children,
}) {
  return (
    <Grid
      item
      style={{ flex: 'auto', flexBasis: '100%', width: '100%' }}
    >
      <Paper
        style={{
          padding: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            id={title ? undefined : titleId}
            style={{ fontWeight: 'bold' }}
          >
            {title}
          </Text>
          {renderActions}
        </div>
        {children}
      </Paper>
    </Grid>
  );
}
