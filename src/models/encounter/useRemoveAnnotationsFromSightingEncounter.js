import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';

export default function useRemoveAnnotationsFromSightingEncounter() {
  const [displayedError, setDisplayedError] = useState(null);

  const mutation = useMutation(
    async ({ encounterId, annotationIds }) => {
      const operations = annotationIds.map(annotationId => ({
        op: 'remove',
        path: '/annotations',
        value: annotationId,
      }));

      return axios.request({
        url: `${__houston_url__}/api/v1/encounters/${encounterId}`,
        method: 'patch',
        withCredentials: true,
        data: operations,
      });
    },
  );

  const removeAnnotationsFromSightingEncounter = (
    encounterId,
    annotationIds,
  ) => mutation.mutateAsync({ encounterId, annotationIds });

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
    removeAnnotationsFromSightingEncounter,
    onClearError: () => {
      setDisplayedError(null);
    },
    error: displayedError,
  };
}
