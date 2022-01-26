import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';

export default function useAddAnnotationsToAGSEncounter() {
  const [displayedError, setDisplayedError] = useState(null);
  const mutation = useMutation(
    async ({ agsId, encounterId, annotationIds }) => {
      const operations = annotationIds.map(annotationId => ({
        op: 'add',
        path: '/annotations',
        value: annotationId,
      }));

      return axios.request({
        url: `${__houston_url__}/api/v1/asset_groups/sighting/${agsId}/encounter/${encounterId}`,
        method: 'patch',
        withCredentials: true,
        data: operations,
      });
    },
  );

  const addAnnotationsToAGSEncounter = (
    agsId,
    encounterId,
    annotationIds,
  ) => mutation.mutateAsync({ agsId, encounterId, annotationIds });

  const error = mutation?.error
    ? mutation?.error.toJSON().message
    : null;

  useEffect(
    () => {
      if (error) {
        setDisplayedError(error);
      }
    },
    [error],
  );

  return {
    ...mutation,
    addAnnotationsToAGSEncounter,
    onClearError: () => {
      setDisplayedError(null);
    },
    error: displayedError,
  };
}
