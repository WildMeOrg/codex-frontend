import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import Text from '../Text';

const Core = function ({ Icon, onClick, titleId, style = {} }) {
  const theme = useTheme();

  return (
    <Tooltip title={<Text variant="body2" id={titleId} />}>
      <IconButton
        onClick={onClick}
        style={{
          marginLeft: 8,
          padding: 10,
          backgroundColor: theme.palette.grey.A100,
          color: theme.palette.grey.A400,
          ...style,
        }}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

export default function HeaderButton({
  showBadge,
  badgeContent,
  ...rest
}) {
  if (showBadge)
    return (
      <Badge
        color="secondary"
        overlap="circular"
        badgeContent={badgeContent}
      >
        <Core {...rest} />
      </Badge>
    );
  return <Core {...rest} />;
}
