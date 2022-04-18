import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useAddEncounter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addEncounter = async (sightingId, values) => {
    const operation = {
      op: 'add',
      path: '/encounters',
      value: values,
    };

    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/sightings/${sightingId}`,
        withCredentials: true,
        method: 'patch',
        data: [operation],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return { success: true, response: patchResponse };
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      return { success: false, response: postError };
    }
  };

  const tmpError = 'addEncounter error'; //deleteMe

  return {
    addEncounter,
    loading,
    error: tmpError,
    setError,
    success,
    setSuccess,
  };
}
