import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useAddKeyword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addKeyword = async (
    annotationId,
    keywordGuid,
    keywordValue,
  ) => {
    const payload = keywordGuid || {
      value: keywordValue,
      source: 'user',
    };

    const operations = [
      {
        op: 'add',
        path: '/keywords',
        value: payload,
      },
    ];

    try {
      setLoading(true);
      setError(null);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/annotations/${annotationId}`,
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
    } catch (patchError) {
      const backendErrorMessage = get(patchError, [
        'response',
        'data',
        'message',
      ]);
      const errorMessage =
        backendErrorMessage || formatError(patchError);
      setLoading(false);
      setError(errorMessage);
      setSuccess(false);
      return false;
    }
  };

  return {
    addKeyword,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
