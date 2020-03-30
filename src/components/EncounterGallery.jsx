import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EncounterCard from './EncounterCard';

export default function EncounterGallery({ title, encounters }) {
  return (
    <div style={{ marginLeft: 12 }}>
      <Typography
        component="h5"
        variant="h5"
        style={{ margin: '28px 0 16px 0' }}
      >
        {title}
      </Typography>
      <Grid container spacing={3}>
        {encounters.map(encounter => (
          <Grid item>
            <EncounterCard encounter={encounter} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
