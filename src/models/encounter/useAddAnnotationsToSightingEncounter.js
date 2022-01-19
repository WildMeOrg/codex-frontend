import axios from 'axios';
import { useMutation } from 'react-query';

export default function useAddAnnotationsToSightingEncounter() {
  const mutation = useMutation(
    async ({ encounterId, annotationIds }) => {
      const operations = annotationIds.map(annotationId => ({
        op: 'add',
        path: '/annotations',
        value: annotationId,
      }));

      return axios.request({
        // url: `${__houston_url__}/api/v1/module/encounters/${encounterId}`,
        url: `${__houston_url__}/api/v1/encounters/${encounterId}`,
        method: 'patch',
        withCredentials: true,
        data: operations,
      });
    },
  );

  const addAnnotationsToSightingEncounter = (
    encounterId,
    annotationIds,
  ) => mutation.mutateAsync({ encounterId, annotationIds });

  const error = mutation?.error
    ? mutation?.error.toJSON().message
    : null;

  return {
    ...mutation,
    addAnnotationsToSightingEncounter,
    error,
  };
}
