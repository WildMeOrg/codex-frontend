import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Text from '../Text';
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
      <List dense>
        {metadata.map(datum => (
          <ListItem key={datum.id}>
            <ListItemIcon style={{ minWidth: 36 }}>
              <datum.icon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Text
                  component="span"
                  variant="caption"
                  id={datum.titleId}
                />
              }
              secondary={
                <Text component="span" variant="body2">
                  {datum.renderValue
                    ? datum.renderValue(datum.value)
                    : datum.value}
                </Text>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
