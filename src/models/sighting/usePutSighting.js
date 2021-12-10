import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePutSighting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const putSighting = async data => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/sightings/`,
        withCredentials: true,
        method: 'post',
        data,
      });
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
    putSighting,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
