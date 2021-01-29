import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Card from './Card';

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
}) {
  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        <IconButton aria-label="Add relationship">
          <AddIcon />
        </IconButton>
      }
    >
      No relationships
    </Card>
  );
}
