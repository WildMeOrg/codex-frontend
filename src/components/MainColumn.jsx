import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function({ children, style, ...rest }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const marginTop = isSm ? 56 : 64;

  return (
    <div
      style={{
        margin: `${marginTop}px auto 200px auto`,
        width: '100%',
        position: 'relative',
        maxWidth: 851,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
