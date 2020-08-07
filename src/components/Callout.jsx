import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
      justify="center"
      direction="column"
      spacing={1}
    >
      <Grid item>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid item>
        <Typography
          style={{
            textAlign: 'center',
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          {description}
        </Typography>
      </Grid>
      {children}
      <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
        {actions}
      </Grid>
    </Grid>
  );
}
