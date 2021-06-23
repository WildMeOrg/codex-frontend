import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useDeleteAnnotation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteAnnotation = async annotationId => {
    try {
      setLoading(true);
      const deleteResponse = await axios({
        url: `${__houston_url__}/api/v1/annotations/${annotationId}`,
        withCredentials: true,
        method: 'delete',
      });
      console.log(deleteResponse);
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
    deleteAnnotation,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
