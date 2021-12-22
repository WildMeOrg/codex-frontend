import axios from 'axios';
import { useMutation } from 'react-query';

export default function usePatchCollaboration() {
  const collabPatchMutation = useMutation(async dataObj => {
    const collabId = dataObj?.collabId;
    if (dataObj?.dataReverse) {
      console.log('deleteMe got here p1 two-way');
      // it's two-way
      return axios.all([
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
    console.log('deleteMe got here p2 one-way');
    return axios({
      url: `${__houston_url__}/api/v1/collaborations/${collabId}`,
      withCredentials: true,
      method: 'patch',
      data: dataObj?.dataForward,
    });
  });

  const collabPatchArgs = (
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

  return { collabPatchArgs, ...collabPatchMutation };
}
