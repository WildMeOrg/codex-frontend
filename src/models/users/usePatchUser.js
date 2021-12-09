import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import queryKeys from '../../constants/queryKeys';
import { formatError } from '../../utils/formatters';

export default function usePatchUser(userId) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const replaceUserProperty = async (path, value) => {
    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/users/${userId}`,
        withCredentials: true,
        method: 'patch',
        data: [
          {
            op: 'replace',
            path,
            value,
          },
        ],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
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

  const replaceUserProperties = async (
    properties,
    currentPassword,
  ) => {
    try {
      setLoading(true);
      const propertyData = properties.map(p => ({
        op: 'replace',
        path: get(p, 'path'), // '/is_admin'
        value: get(p, 'value'), // 'true'
      }));
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
        data: [...currentPasswordTest, ...propertyData],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
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

  const removeUserProperty = async (path, currentPassword) => {
    try {
      setLoading(true);
      const propertyPatch = [
        {
          op: 'remove',
          path,
        },
      ];
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
    replaceUserProperty,
    replaceUserProperties,
    removeUserProperty,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
