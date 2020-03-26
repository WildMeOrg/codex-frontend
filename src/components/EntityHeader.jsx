import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

export default function({ imgSrc, name, fields }) {
  return (
    <>
      <Grid container style={{ margin: '24px 0' }}>
        <Grid item>
          <img
            src={imgSrc}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              marginLeft: 12,
              border: '1px solid #ccc',
            }}
          />
        </Grid>
        <Grid item style={{ marginLeft: 28 }}>
          <Typography variant="h4" component="h4">
            {name}
          </Typography>
          <Typography>et</Typography>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
}
