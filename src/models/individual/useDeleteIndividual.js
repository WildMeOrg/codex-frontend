import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useDeleteIndividual() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteIndividual = async individualId => {
    try {
      setLoading(true);
      const deleteResponse = await axios({
        url: `${__houston_url__}/api/v1/individuals/${individualId}`,
        withCredentials: true,
        method: 'delete',
      });
      const responseStatus = get(deleteResponse, 'status');
      const successful = responseStatus === 204;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(deleteResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    deleteIndividual,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
