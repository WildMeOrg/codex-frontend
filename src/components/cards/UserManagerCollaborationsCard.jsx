import React from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useMutation, useQueryClient } from 'react-query';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { prefixApiUrl } from '../../utils/axiosUtils';
import { getUserQueryKey } from '../../constants/queryKeys';
import AddCollaboratorButton from './collaborations/AddCollaboratorButton';
import UserManagerCollaborationEditTable from '../UserManagerCollaborationEditTable';
import useHandleRequestError from '../../hooks/useHandleRequestError';

export default function UserManagerCollaborationsCard({ userData }) {
  const queryClient = useQueryClient();
  const collaborations = get(userData, ['collaborations'], []);
  const handleRequestError = useHandleRequestError();

  const userGuid = userData?.guid;

  async function mutationFn({ userGuid: secondUserGuid }) {
    try {
      const result = await axios.request({
        url: prefixApiUrl('/collaborations/'),
        method: 'POST',
        data: {
          user_guid: userGuid,
          second_user_guid: secondUserGuid,
        },
      });
      return result;
    } catch (error) {
      return handleRequestError(error);
    }
  }

  const mutation = useMutation(mutationFn, {
    onSuccess: async () =>
      queryClient.invalidateQueries(getUserQueryKey(userGuid)),
  });

  return (
    <Card>
      <CardContent>
        <UserManagerCollaborationEditTable
          inputData={collaborations}
        />
      </CardContent>
      <CardActions>
        <AddCollaboratorButton
          userData={userData}
          mutation={mutation}
        />
      </CardActions>
    </Card>
  );
}
