import axios from 'axios';
import { get } from 'lodash-es';
import { useQuery } from 'react-query';
import * as Sentry from '@sentry/react';
import queryKeys from '../../constants/queryKeys';

export default function useGetMe() {
  const result = useQuery(
    queryKeys.me,
    async () => {
      const response = await axios.request({
        url: `${__houston_url__}/api/v1/users/me`,
        method: 'get',
      });
      if (!__DEV__) {
        Sentry.setUser({
          email: get(response, ['data', 'email']),
          id: get(response, ['data', 'guid']),
          username: get(response, ['data', 'full_name']),
        });
      }
      return response;
    },
    {
      staleTime: Infinity,
    },
  );

  const { data, isLoading, error } = result;

  return {
    data: get(data, 'data'),
    loading: isLoading,
    error: error ? error.toJSON().message : null,
  };
}
