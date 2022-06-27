import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePatchNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const patchNotification = async (notificationId, data) => {
    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/notifications/${notificationId}`,
        withCredentials: true,
        method: 'patch',
        data,
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
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

  const markRead = async notificationId => {
    setLoading(true);
    const result = await patchNotification(notificationId, [
      {
        op: 'replace',
        path: '/is_read',
        value: true,
      },
    ]);
    setLoading(false);
    return result;
  };

  return {
    markRead,
    patchNotification,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
