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
    encounterGuid = null,
  ) => {
    try {
      const additionalProperties = encounterGuid
        ? { encounter_guid: encounterGuid }
        : {};
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
          ...additionalProperties,
        },
      });

      // const response = await axios({
      //   url: `${__houston_url__}/api/v1/annotations/`,
      //   withCredentials: true,
      //   method: 'post',
      //   data: {
      //     viewpoint,
      //     asset_guid: assetId,
      //     encounter_guid: encounterGuid,
      //     ia_class: iaClass,
      //     bounds: {
      //       theta,
      //       rect,
      //     },
      //   },
      // });
      const successful = get(response, 'status') === 200;
      const newAnnotationGuid = get(response, ['data', 'guid']);
      if (successful) {
        setSuccess(true);
        setError(null);
        setLoading(false);
        return newAnnotationGuid;
      }

      const backendErrorMessage = response?.message;
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

  const tmpError = 'post annotation error';

  return {
    postAnnotation,
    loading,
    error: tmpError,
    setError,
    success,
    setSuccess,
  };
}
