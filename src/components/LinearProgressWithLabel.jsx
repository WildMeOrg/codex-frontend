import React from 'react';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';

import Text from './Text';

export default function LinearProgressWithLabel({
  label,
  containerStyle,
  labelStyle,
  ...linearProgressProps
}) {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" style={containerStyle}>
      <LinearProgress
        {...linearProgressProps}
        style={{
          width: '100%',
          marginRight: `${theme.spacing(1)}px`,
        }}
      />
      <Text
        variant="body2"
        component="p"
        style={{
          textAlign: 'right',
          whiteSpace: 'nowrap',
          ...labelStyle,
        }}
      >
        {label}
      </Text>
    </Box>
  );
}
