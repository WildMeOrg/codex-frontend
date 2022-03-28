import axios from 'axios';
import { useMutation } from 'react-query';
import { get } from 'lodash-es';

const collabEditPath = '/managed_view_permission';
const collabEditOp = 'replace';
const revokedPermission = 'revoked';

/* Deviates from useMutate pattern due to need for Promise.all */
export default function useRevokeCollaboration() {
  const mutation = useMutation(async collaboration => {
    const collaborationGuid = collaboration?.guid;

    const collaborationData = [
      {
        op: collabEditOp,
        path: collabEditPath,
        value: {
          user_guid: get(collaboration, 'userOneGuid'),
          permission: revokedPermission,
        },
      },
    ];
    const collaborationDataTheOtherWay = [
      {
        op: collabEditOp,
        path: collabEditPath,
        value: {
          user_guid: get(collaboration, 'userTwoGuid'),
          permission: revokedPermission,
        },
      },
    ];

    return Promise.all([
      axios.request({
        url: `${__houston_url__}/api/v1/collaborations/${collaborationGuid}`,
        withCredentials: true,
        method: 'patch',
        data: collaborationData,
      }),
      axios.request({
        url: `${__houston_url__}/api/v1/collaborations/${collaborationGuid}`,
        withCredentials: true,
        method: 'patch',
        data: collaborationDataTheOtherWay,
      }),
    ]);
  });

  const revokeCollaboration = collaboration =>
    mutation.mutateAsync(collaboration);

  const {
    isSuccess,
    isError,
    isLoading,
    error: collabPatchError,
  } = mutation;

  const error = collabPatchError
    ? collabPatchError.toJSON().message
    : null;

  return {
    revokeCollaboration,
    isSuccess,
    isError,
    isLoading,
    error,
  };
}
