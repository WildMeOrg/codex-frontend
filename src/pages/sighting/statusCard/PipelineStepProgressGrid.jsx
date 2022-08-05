import React from 'react';

import Grid from '@material-ui/core/Grid';

import ProgressCard from '../../../components/progress/ProgressCard';
import QueueCard from '../../../components/progress/QueueCard';
import TimeRemainingCard from '../../../components/progress/TimeRemainingCard';

const cardStyle = {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function PipelineStepProgressGrid({
  pipelineStep,
  style,
}) {
  const { ahead, eta, progress } = pipelineStep || {};

  return (
    <Grid container spacing={1} style={style}>
      <Grid item xs={6}>
        <QueueCard ahead={ahead} style={cardStyle} />
      </Grid>
      <Grid item xs={6}>
        <ProgressCard progress={progress} style={cardStyle} />
      </Grid>
      <Grid item xs={12}>
        <TimeRemainingCard timeRemaining={eta} style={cardStyle} />
      </Grid>
    </Grid>
  );
}
