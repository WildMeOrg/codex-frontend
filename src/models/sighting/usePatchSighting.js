import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';
import formatPropertiesForPatch from '../../utils/formatPropertiesForPatch';

export default function usePatchSighting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateProperties = async (sightingId, dictionary) => {
    const operations = formatPropertiesForPatch(dictionary);

    try {
      setLoading(true);
      setError(null);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/sightings/${sightingId}`,
        withCredentials: true,
        method: 'patch',
        data: operations,
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      const backendErrorMessage = get(patchResponse, 'message');
      const errorMessage =
        backendErrorMessage || formatError(patchResponse);
      setError(errorMessage);
      setSuccess(false);
      return false;
    } catch (postError) {
      const backendErrorMessage = get(postError, [
        'response',
        'data',
        'message',
      ]);
      const errorMessage =
        backendErrorMessage || formatError(postError);
      setLoading(false);
      setError(errorMessage);
      setSuccess(false);
      return false;
    }
  };

  return {
    updateProperties,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
