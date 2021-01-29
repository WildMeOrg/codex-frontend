import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Card from './Card';

export default function ProjectsCard({
  title,
  titleId = 'PROJECTS',
  projects,
}) {
  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        <IconButton size="small" aria-label="Add project">
          <AddIcon />
        </IconButton>
      }
    >
      <List>
        {projects.map(project => (
          <ListItem key={project.id}>
            <ListItemText>{project.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
