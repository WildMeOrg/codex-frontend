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
      const response = await axios({
        url: `${__houston_url__}/api/v1/asset_groups/`,
        withCredentials: true,
        method: 'post',
        data,
      });
      console.log(response);
      const successful = get(response, ['data', 'success'], false);
      const newSightingId = get(response, ['data', 'result', 'id']);
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return newSightingId;
      }

      setError(formatError(response));
      setSuccess(false);
      setLoading(false);
      return null;
    } catch (postError) {
      setError(formatError(postError));
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
