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
    viewpoint,
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
          viewpoint,
          asset_guid: assetId,
          ia_class: iaClass,
          bounds: {
            theta,
            rect,
          },
        },
      });
      // const successful = get(response, 'status') === 200;
      const successful = false; // TODO deleteMe
      const newAnnotationGuid = get(response, ['data', 'guid']);
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return newAnnotationGuid;
      }

      // const backendErrorMessage = response?.message;
      const backendErrorMessage = 'Boop beep error';
      console.log('deleteMe backendErrorMessage is: ');
      console.log(backendErrorMessage);
      const errorMessage =
        backendErrorMessage || formatError(response);
      setError(errorMessage);
      setSuccess(false);
      setLoading(false);
      return null;
    } catch (postError) {
      console.log('deleteMe error caught: ');
      console.log(postError);
      const backendErrorMessage = get(postError, [
        'response',
        'data',
        'message',
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
