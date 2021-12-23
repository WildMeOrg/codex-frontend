import axios from 'axios';
import { useMutation } from 'react-query';

export default function usePatchCollaboration() {
  const collabPatchMutation = useMutation(async dataObj => {
    const collabId = dataObj?.collabId;

    if (dataObj?.dataReverse) {
      // it's two-way
      return Promise.all([
        axios.request({
          url: `${__houston_url__}/api/v1/collaborations/${collabId}`,
          withCredentials: true,
          method: 'patch',
          data: dataObj?.dataForward,
        }),
        axios.request({
          url: `${__houston_url__}/api/v1/collaborations/${collabId}`,
          withCredentials: true,
          method: 'patch',
          data: dataObj?.dataReverse,
        }),
      ]);
    }
    return axios({
      url: `${__houston_url__}/api/v1/collaborations/${collabId}`,
      withCredentials: true,
      method: 'patch',
      data: dataObj?.dataForward,
    });
  });

  const patchCollaboration = (
    collabId,
    dataForward,
    dataReverse = null,
  ) => {
    let dataObj = {};
    dataObj.collabId = collabId;
    dataObj.dataForward = dataForward;
    if (dataReverse) dataObj.dataReverse = dataReverse;
    return collabPatchMutation.mutate(dataObj);
  };

  const pathCollaborationAsync = (
    collabId,
    dataForward,
    dataReverse = null,
  ) => {
    let dataObj = {};
    dataObj.collabId = collabId;
    dataObj.dataForward = dataForward;
    if (dataReverse) dataObj.dataReverse = dataReverse;
    return collabPatchMutation.mutateAsync(dataObj);
  };

  const {
    isSuccess,
    isError,
    isLoading,
    error: collabPatchError,
  } = collabPatchMutation;

  const error = collabPatchError
    ? collabPatchError.toJSON().message
    : null;

  return {
    patchCollaboration,
    pathCollaborationAsync,
    isSuccess,
    isError,
    isLoading,
    error,
  };
}
