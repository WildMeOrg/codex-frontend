import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePostAssetGroup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postAssetGroup = async data => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        url: `${__houston_url__}/api/v1/asset_groups/`,
        withCredentials: true,
        method: 'post',
        data,
      });
      const successful = get(response, 'status') === 200;
      const assetGroupData = get(response, 'data');
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return assetGroupData;
      }

      const backendErrorMessage = response?.message;
      const errorMessage =
        backendErrorMessage || formatError(response);
      setError(errorMessage);
      setSuccess(false);
      setLoading(false);
      return null;
    } catch (postError) {
      const backendErrorMessage = get(postError, [
        'response',
        'data',
        'message',
      ]);
      const errorMessage =
        backendErrorMessage || formatError(postError);

      setError(errorMessage);
      setSuccess(false);
      setLoading(false);
      return null;
    }
  };

  return {
    postAssetGroup,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
