import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

const sizeMap = {
  h1: {
    mobile: 32,
    desktop: 48,
    component: 'h1',
  },
  h2: {
    mobile: 28,
    desktop: 40,
    component: 'h2',
  },
  h5: {
    mobile: 20,
    desktop: 24,
    component: 'h5',
  },
  subtitle1: {
    mobile: 16,
    desktop: 20,
    component: 'p',
  },
};

export default function ResponsiveText({
  variant,
  children,
  mobileStyle = {},
  desktopStyle = {},
  style = {},
  ...rest
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const smallSize = get(sizeMap, [variant, 'mobile'], 12);
  const largeSize = get(sizeMap, [variant, 'desktop'], 14);
  const component = get(sizeMap, [variant, 'component'], undefined);

  const responsiveStyle = isSm
    ? { fontSize: smallSize, ...mobileStyle }
    : { fontSize: largeSize, ...desktopStyle };

  return (
    <Typography
      variant={variant}
      component={component}
      style={{ ...responsiveStyle, ...style }}
      {...rest}
    >
      {children}
    </Typography>
  );
}
