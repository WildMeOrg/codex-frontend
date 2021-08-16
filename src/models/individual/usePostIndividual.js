import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePostIndividual() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postIndividual = async encounterId => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        url: `${__houston_url__}/api/v1/individuals/`,
        withCredentials: true,
        method: 'post',
        data: {
          encounters: [{ id: encounterId }],
        },
      });
      const successful = get(response, 'status') === 200;
      const newIndividualGuid = get(response, [
        'data',
        'result',
        'id',
      ]);
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return newIndividualGuid;
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
    postIndividual,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
