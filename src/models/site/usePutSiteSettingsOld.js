import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';

import queryKeys from '../../constants/queryKeys';
import { formatError } from '../../utils/formatters';

export default function usePutSiteSettings() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const putSiteSettings = async data => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/main`,
        withCredentials: true,
        method: 'post',
        data,
      });
      const successful = response?.status === 200;
      setLoading(false);
      if (successful) {
        queryClient.invalidateQueries(queryKeys.settingsConfig);
        setSuccess(true);
        setError(null);
      } else {
        setError(formatError(response));
        setSuccess(false);
      }
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
    }
  };

  const putSiteSetting = async (property, data) => {
    try {
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/main/${property}`,
        withCredentials: true,
        method: 'post',
        data: {
          _value: data,
        },
      });
      const successful = response?.status === 200;
      if (successful) {
        queryClient.invalidateQueries(queryKeys.settingsConfig);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(response));
      setSuccess(false);
      return false;
    } catch (postError) {
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    putSiteSettings,
    putSiteSetting,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
