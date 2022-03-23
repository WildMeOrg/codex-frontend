import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import { usePatch } from '../../hooks/useMutate';
import queryKeys, {
  getUserQueryKey,
} from '../../constants/queryKeys';
import { formatError } from '../../utils/formatters';

export function useReplaceUserProperty() {
  return usePatch({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ path, value }) => [{ op: 'replace', path, value }],
    deriveQueryKeys: ({ userGuid }) => [
      getUserQueryKey(userGuid),
      queryKeys.me,
      queryKeys.users,
    ],
  });
}

export function useReplaceUserProperties() {
  return usePatch({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ properties, password }) => {
      const propertyData = properties.map(p => ({
        op: 'replace',
        path: get(p, 'path'), // '/is_admin'
        value: get(p, 'value'), // 'true'
      }));
      const passwordTest = password
        ? [
            {
              op: 'test',
              path: '/current_password',
              value: password,
            },
          ]
        : [];
      return [...passwordTest, ...propertyData];
    },
    deriveQueryKeys: ({ userGuid }) => [
      getUserQueryKey(userGuid),
      queryKeys.me,
      queryKeys.users,
    ],
  });
}

export function useRemoveUserProperty() {
  return usePatch({
    deriveUrl: ({ userGuid }) => `/users/${userGuid}`,
    deriveData: ({ path, password }) => {
      const propertyPatch = [{ op: 'remove', path }];
      const passwordTest = password
        ? [
            {
              op: 'test',
              path: '/current_password',
              value: password,
            },
          ]
        : [];
      return [...passwordTest, ...propertyPatch];
    },
    deriveQueryKeys: ({ userGuid }) => [
      getUserQueryKey(userGuid),
      queryKeys.me,
      queryKeys.users,
    ],
  });
}

export default function usePatchUser(userId) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const removeUserProperty = async (path, currentPassword) => {
    try {
      setLoading(true);
      const propertyPatch = [{ op: 'remove', path }];
      const currentPasswordTest = currentPassword
        ? [
            {
              op: 'test',
              path: '/current_password',
              value: currentPassword,
            },
          ]
        : [];
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/users/${userId}`,
        withCredentials: true,
        method: 'patch',
        data: [...currentPasswordTest, ...propertyPatch],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        queryClient.invalidateQueries(queryKeys.me);
        queryClient.invalidateQueries(queryKeys.users);
        return true;
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    replaceUserProperties,
    removeUserProperty,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
