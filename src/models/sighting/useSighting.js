import axios from 'axios';
import { useQuery } from 'react-query';

import { getSightingQueryKey } from '../../constants/queryKeys';

export default function useSighting(sightingId) {
  const result = useQuery(
    getSightingQueryKey(sightingId),
    async () => {
      return axios.request({
        url: `${__houston_url__}/api/v1/sightings/${sightingId}`,
        method: 'get',
      });
    },
    {
      refetchInterval: 5000,
      enabled: Boolean(sightingId),
    },
  );

  const { data, isLoading, error } = result;

  return {
    ...result,
    data: data?.data,
    loading: isLoading,
    error: error ? error.toJSON().message : null,
  };
}
