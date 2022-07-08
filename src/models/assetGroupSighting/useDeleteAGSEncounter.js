import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';

export default function useDeleteAGSEncounter() {
  const [displayedError, setDisplayedError] = useState(null);
  const mutation = useMutation(async ({ agsId, encounterId }) => {
    const operation = {
      op: 'remove',
      path: '/encounters',
      value: encounterId,
    };

    return axios.request({
      url: `${__houston_url__}/api/v1/asset_groups/sighting/${agsId}`,
      method: 'patch',
      withCredentials: true,
      data: [operation],
    });
  });

  const deleteAGSEncounter = (agsId, encounterId) =>
    mutation.mutateAsync({ agsId, encounterId });

  const error = mutation?.error
    ? mutation?.error.toJSON().message
    : null;

  useEffect(() => {
    if (error) {
      setDisplayedError(error);
    }
  }, [error]);

  return {
    ...mutation,
    deleteAGSEncounter,
    onClearError: () => {
      setDisplayedError(null);
    },
    error: displayedError,
  };
}
