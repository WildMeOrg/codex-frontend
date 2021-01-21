import React from 'react';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';

import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

function Core({ Icon, onClick, titleId, style = {} }) {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <Tooltip
      title={
        <Typography variant="body2">
          {intl.formatMessage({ id: titleId })}
        </Typography>
      }
    >
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
}

export default function HeaderButton({ showBadge, ...rest }) {
  if (showBadge)
    return (
      <Badge color="secondary" overlap="circle" badgeContent="1">
        <Core {...rest} />
      </Badge>
    );
  return <Core {...rest} />;
}
