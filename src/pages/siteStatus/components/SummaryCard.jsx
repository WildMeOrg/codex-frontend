import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Text from '../../../components/Text';

export default function SummaryCard({
  title,
  content,
  loading = false,
  ...rest
}) {
  const isXs = useMediaQuery(theme => theme.breakpoints.only('xs'));

  return (
    <Grid item {...rest}>
      <Paper
        square
        variant="outlined"
        style={{
          padding: '12px',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Text
          variant="body1"
          component="dt"
          gutterBottom
          style={{
            fontWeight: 'bold',
            fontSize: '0.9em',
            display: isXs ? 'inline-block' : 'block',
            marginRight: isXs ? '1em' : 0,
          }}
        >
          {title}
        </Text>
        {loading ? (
          <Skeleton variant="text" width="45%" />
        ) : (
          <Text
            variant="body2"
            component="dd"
            style={{
              fontSize: '1.1em',
              marginInlineStart: 0,
              display: isXs ? 'inline-block' : 'block',
            }}
          >
            {content}
          </Text>
        )}
      </Paper>
    </Grid>
  );
}
