import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useRequestCollaboration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const requestEditAccess = async collaborationId => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        url: `${__houston_url__}/api/v1/collaborations/edit_request/${collaborationId}`,
        withCredentials: true,
        method: 'post',
        // data: {},
      });
      console.log(response);
      const successful = get(response, 'status') === 200;
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return successful;
      }

      const backendErrorMessage = get(response, 'passed_message');
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
        'passed_message',
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
    requestEditAccess,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
