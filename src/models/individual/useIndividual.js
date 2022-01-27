import axios from 'axios';
import { useQuery } from 'react-query';

import { getIndividualQueryKey } from '../../constants/queryKeys';

export default function useIndividual(individualId) {
  const result = useQuery(
    getIndividualQueryKey(individualId),
    async () => {
      return axios.request({
        url: `${__houston_url__}/api/v1/individuals/${individualId}`,
        method: 'get',
      });
    },
    {
      enabled: Boolean(individualId),
    },
  );

  const { data, isLoading, error } = result;

  return {
    ...result,
    data: data?.data,
    statusCode: data?.status,
    loading: isLoading,
    error: error ? error.toJSON().message : null,
  };
}
