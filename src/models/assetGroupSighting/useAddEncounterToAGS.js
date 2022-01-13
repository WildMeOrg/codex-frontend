import axios from 'axios';
import { useMutation } from 'react-query';

export default function useAddEncounterToAGS() {
  const mutation = useMutation(async ({ id, properties }) => {
    const operation = {
      op: 'add',
      path: '/encounters',
      value: properties,
    };

    return axios.request({
      url: `${__houston_url__}/api/v1/asset_groups/sighting/${id}`,
      method: 'patch',
      withCredentials: true,
      data: [operation],
    });
  });

  const addEncounterToAGS = (id, properties) =>
    mutation.mutateAsync({ id, properties });

  const error = mutation?.error
    ? mutation?.error.toJSON().message
    : null;

  return {
    ...mutation,
    addEncounterToAGS,
    error,
  };
}
