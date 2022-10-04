import React from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useMutation, useQueryClient } from 'react-query';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { prefixApiURL } from '../../utils/axiosUtils';
import { getUserQueryKey } from '../../constants/queryKeys';
import AddCollaboratorButton from './collaborations/AddCollaboratorButton';
import UserManagerCollaborationEditTable from '../UserManagerCollaborationEditTable';
import useHandleAxiosError from '../../hooks/useHandleAxiosError';

export default function UserManagerCollaborationsCard({ userData }) {
  const queryClient = useQueryClient();
  const collaborations = get(userData, ['collaborations'], []);
  const handleAxiosError = useHandleAxiosError();

  const userGuid = userData?.guid;

  async function mutationFn({ userGuid: secondUserGuid }) {
    return axios
      .request({
        url: prefixApiURL('/collaborations/'),
        method: 'POST',
        data: {
          user_guid: userGuid,
          second_user_guid: secondUserGuid,
        },
      })
      .catch(handleAxiosError);
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
