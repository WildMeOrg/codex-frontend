import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useMutation } from 'react-query';

// import { formatError } from '../../utils/formatters';

export default function usePatchCollaboration() {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(false);

  // const patchCollaboration = async (collaborationId, data) => {
  // try {
  // setLoading(true);
  const collabPatchMutation = useMutation(
    async (collaborationId, data) =>
      axios.request({
        url: `${__houston_url__}/api/v1/collaborations/${collaborationId}`,
        withCredentials: true,
        method: 'patch',
        data,
      }),
  );

  const collabPatchArgs = (collabId, data) =>
    collabPatchMutation.mutate(collabId, data);

  return { collabPatchArgs, ...collabPatchMutation };
  // collabPatchMutation.mutate(collaborationId);
  // return get(response, 'data.response');
  // return response;
  // },
  // {
  //   staleTime: Infinity,
  // },
  // );

  // const { data, isLoading, error } = patchResult;
  // console.log('deleteMe data in usePatchCollaborations is: ');
  // console.log(data);
  // console.log('deleteMe isLoading in usePatchCollaboration is: ');
  // console.log(isLoading);
  // console.log('deleteMe error in usePatchCollaboration is: ');
  // console.log(error);
  // return {
  //   data: data?.data,
  //   loading: isLoading,
  //   error: error?.toJSON().message,
  // };
  //     const responseStatus = patchResponse?.status;
  //     console.log('deleteMe responseStatus is: ' + responseStatus);
  //     const successful = responseStatus === 200;
  //     if (successful) {
  //       setLoading(false);
  //       setSuccess(true);
  //       setError(null);
  //       return true;
  //     }

  //     setError(formatError(patchResponse));
  //     setSuccess(false);
  //     return false;
  //   } catch (postError) {
  //     setLoading(false);
  //     setError(formatError(postError));
  //     setSuccess(false);
  //     return false;
  //   }
  // };

  // return {
  //   patchCollaboration,
  //   loading,
  //   error,
  //   setError,
  //   success,
  //   setSuccess,
  // };
}
