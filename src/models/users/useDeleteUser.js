import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import queryKeys from '../../constants/queryKeys';
import { formatError } from '../../utils/formatters';

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteUser = async (userGuid, currentPassword) => {
    try {
      setLoading(true);
      const userDeleteData = {
        op: 'remove',
        path: `/users/${userGuid}`,
        value: userGuid,
      };
      const currentPasswordTest = currentPassword
        ? [
            {
              op: 'test',
              path: '/current_password',
              value: currentPassword,
            },
          ]
        : [];

      const deleteResponse = await axios({
        url: `${__houston_url__}/api/v1/users/${userGuid}`,
        withCredentials: true,
        method: 'delete',
        data: [...currentPasswordTest, userDeleteData],
      });
      const responseStatus = get(deleteResponse, 'status');
      const successful = responseStatus === 204;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        queryClient.invalidateQueries(queryKeys.users);
        return true;
      }

      setError(formatError(deleteResponse));
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
    deleteUser,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
