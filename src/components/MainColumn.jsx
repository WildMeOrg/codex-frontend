import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function({
  children,
  style,
  fullWidth = false,
  ...rest
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const marginTop = isSm ? 56 : 72;

  return (
    <div
      style={{
        margin: `${marginTop}px auto 120px auto`,
        width: '100%',
        position: 'relative',
        maxWidth: fullWidth ? 905 : 851,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
