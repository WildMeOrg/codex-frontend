import React from 'react';
import Grid from '@material-ui/core/Grid';
import Text from './Text';

export default function Callout({
  title,
  description,
  actions,
  children,
}) {
  return (
    <Grid
      container
      style={{
        width: '100%',
        padding: 20,
        margin: '20px auto',
        maxWidth: '95vw',
        border: '5px double #7716d8',
      }}
      alignItems="center"
      justifyContent="center"
      direction="column"
      spacing={1}
    >
      <Grid item>
        <Text variant="h5">{title}</Text>
      </Grid>
      <Grid item>
        <Text
          style={{
            textAlign: 'center',
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          {description}
        </Text>
      </Grid>
      {children}
      <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
        {actions}
      </Grid>
    </Grid>
  );
}
