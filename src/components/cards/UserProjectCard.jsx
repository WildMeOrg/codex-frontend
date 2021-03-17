import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Text from '../Text';
import Link from '../Link';
import Card from './Card';

export default function UserProjectCard({
  title,
  titleId = 'PROJECTS',
  projects,
  renderActions,
}) {
  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={renderActions}
    >
      <List>
        {projects.map(project => (
          <ListItem key={project.id}>
            <ListItemText
              primary={
                <Link href={project.href}>{project.name}</Link>
              }
              secondary={
                <Text
                  component="span"
                  variant="body2"
                  style={{ fontStyle: 'italic' }}
                >
                  {`${project.count} sightings`}
                </Text>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
