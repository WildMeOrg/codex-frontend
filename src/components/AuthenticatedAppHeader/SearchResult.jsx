import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import Text from '../Text';
import Link from '../Link';

export default function SearchResult({
  avatarLetter,
  onClick,
  href,
  primaryText,
  secondaryText,
}) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{avatarLetter}</Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Link onClick={onClick} href={href} noUnderline>
            {primaryText}
          </Link>
        }
        secondary={<Text variant="caption">{secondaryText}</Text>}
      />
    </ListItem>
  );
}
