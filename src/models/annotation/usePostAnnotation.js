import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePostAnnotation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postAnnotation = async (
    assetId,
    iaClass,
    rect,
    theta = 0,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios({
        url: `${__houston_url__}/api/v1/annotations/`,
        withCredentials: true,
        method: 'post',
        data: {
          asset_guid: assetId,
          ia_class: iaClass,
          bounds: {
            theta,
            rect,
          },
        },
      });
      const successful = get(response, 'status') === 200;
      const newAnnotationGuid = get(response, ['data', 'guid']);
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return newAnnotationGuid;
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
    postAnnotation,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
