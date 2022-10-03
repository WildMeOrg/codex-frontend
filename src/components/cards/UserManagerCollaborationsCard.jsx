import React from 'react';
import { get } from 'lodash-es';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import AddCollaboratorButton from './collaborations/AddCollaboratorButton';
import UserManagerCollaborationEditTable from '../UserManagerCollaborationEditTable';

export default function UserManagerCollaborationsCard({ userData }) {
  const collaborations = get(userData, ['collaborations'], []);

  return (
    <Card>
      <CardContent>
        <UserManagerCollaborationEditTable
          inputData={collaborations}
        />
      </CardContent>
      <CardActions>
        <AddCollaboratorButton />
      </CardActions>
    </Card>
  );
}
