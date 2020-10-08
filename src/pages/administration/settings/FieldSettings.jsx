import React from 'react';
import Grid from '@material-ui/core/Grid';
import CategoryTable from './CategoryTable';

export default function FieldSettings() {
  return (
    <Grid container direction="column" style={{ marginTop: 40 }}>
      <CategoryTable />
    </Grid>
  );
}
