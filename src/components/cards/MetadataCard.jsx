import React from 'react';
import { FormattedMessage } from 'react-intl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Card from './Card';

export default function MetadataCard({
  title,
  titleId = 'METADATA',
  metadata,
  editable = false,
}) {
  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        editable ? (
          <IconButton size="small" aria-label="Edit metadata">
            <EditIcon />
          </IconButton>
        ) : (
          undefined
        )
      }
    >
      <List>
        {metadata.map(datum => (
          <ListItem key={datum.id}>
            <ListItemIcon>
              <datum.icon />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id={datum.titleId} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
