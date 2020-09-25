import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

const sizeMap = {
  h1: {
    mobile: 32,
    desktop: 48,
  },
  h2: {
    mobile: 28,
    desktop: 40,
  },
  subtitle1: {
    mobile: 16,
    desktop: 20,
  },
};

export default function ResponsiveHeader({
  component = 'h2',
  children,
  style = {},
  ...rest
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const smallSize = sizeMap[component].mobile;
  const largeSize = sizeMap[component].desktop;

  return (
    <Typography
      variant={component}
      component={component}
      style={{ fontSize: isSm ? smallSize : largeSize, ...style }}
      {...rest}
    >
      {children}
    </Typography>
  );
}
