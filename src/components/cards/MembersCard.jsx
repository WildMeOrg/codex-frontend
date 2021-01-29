import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import Text from '../Text';
import Card from './Card';

export default function MembersCard({
  title,
  titleId = 'MEMBERS',
  members,
  editable = false,
}) {
  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        editable ? (
          <IconButton size="small" aria-label="Add member">
            <AddIcon />
          </IconButton>
        ) : (
          undefined
        )
      }
    >
      <List>
        {members.map(member => (
          <ListItem key={member.id}>
            <ListItemAvatar>
              <Avatar src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Natalie_Portman_%2848470988352%29_%28cropped%29.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={member.name}
              secondary={
                <Text
                  component="span"
                  variant="body2"
                  style={{ fontStyle: 'italic' }}
                >
                  {member.role}
                </Text>
              }
            />
            <ListItemSecondaryAction>
              <MoreIcon />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
