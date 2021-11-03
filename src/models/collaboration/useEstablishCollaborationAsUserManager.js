import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useEstablishCollaborationAsUserManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const establishCollaboration = async (userId1, userId2) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        url: `${__houston_url__}/api/v1/collaborations/`,
        withCredentials: true,
        method: 'post',
        data: {
          user_guid: userId1,
          second_user_guid: userId2,
        },
      });
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
    establishCollaboration,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
