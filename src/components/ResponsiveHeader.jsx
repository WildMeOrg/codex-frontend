import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

export default function ResponsiveHeader({
  children,
  style = {},
  ...rest
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Typography
      variant="h3"
      component="h3"
      style={{ fontSize: isSm ? '2rem' : '3rem', ...style }}
      {...rest}
    >
      {children}
    </Typography>
  );
}
