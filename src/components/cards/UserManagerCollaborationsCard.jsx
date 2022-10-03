import React from "react";
import { get } from 'lodash-es';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import UserManagerCollaborationEditTable from "../UserManagerCollaborationEditTable";

export default function UserManagerCollaborationsCard({ userData }) {
  const collaborations = get(userData, ['collaborations'], []);

  return (
    <Card>
      <CardContent>
        <UserManagerCollaborationEditTable inputData={collaborations} />
      </CardContent>
    </Card>
  );
}