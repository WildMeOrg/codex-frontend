import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

const widthMap = {
  small: 300,
  medium: 600,
  large: 900,
};

export default function CardContainer({ size = 'medium', children }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const width = isSm ? '100%' : widthMap[size];

  return (
    <Grid
      container
      spacing={2}
      style={{ maxWidth: '100%', width, margin: '0 16px' }}
    >
      {children}
    </Grid>
  );
}
