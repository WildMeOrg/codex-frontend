import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useQuery } from 'react-query';
import queryKeys from '../../constants/queryKeys';

const limit = 20;
const offset = 0;

export default function useGetUsers() {
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(
    queryKeys.users,
    async () =>
      axios.request({
        url: `${__houston_url__}/api/v1/users/`,
        method: 'get',
        data: {
          limit,
          offset,
        },
      }),
    {
      staleTime: Infinity,
      onError: error => {
        console.log(error);
        setErrorMessage(error.toJSON().message);
      },
    },
  );

  return {
    data: get(result, ['data', 'data']),
    loading: get(result, 'isLoading'),
    error: errorMessage,
    setError: setErrorMessage,
  };
}
