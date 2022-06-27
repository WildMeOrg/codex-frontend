import { get } from 'lodash-es';
import * as Sentry from '@sentry/react';
import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

export default function useGetMe() {
  function onSuccess(response) {
    if (!__DEV__) {
      Sentry.setUser({
        email: get(response, ['data', 'email']),
        id: get(response, ['data', 'guid']),
        username: get(response, ['data', 'full_name']),
      });
    }
  }

  return useFetch({
    queryKey: queryKeys.me,
    url: '/users/me',
    onSuccess,
    queryOptions: { retry: false },
  });
}
