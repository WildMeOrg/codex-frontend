import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

const widthMap = {
  small: 320,
  medium: 560,
  large: 880,
};

const largeMarginMap = {
  small: '0 0 0 8px',
  medium: '0 8px',
  large: '0 8px',
};

const smallMarginMap = {
  small: '0 12px',
  medium: '0 12px',
  large: '0 12px',
};

export default function CardContainer({ size = 'medium', children }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const width = isSm ? '100%' : widthMap[size];
  const margin = isSm ? smallMarginMap[size] : largeMarginMap[size];

  return (
    <Grid
      container
      spacing={2}
      align="start"
      style={{
        maxWidth: '100%',
        width,
        margin,
        height: 'fit-content',
      }}
    >
      {children}
    </Grid>
  );
}
