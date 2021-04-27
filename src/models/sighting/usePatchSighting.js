import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePatchSighting(sightingId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateProperties = async dictionary => {
    const dictionaryCopy = { ...dictionary };
    if ('gps' in dictionaryCopy) {
      dictionaryCopy.decimalLatitude = get(
        dictionaryCopy,
        ['gps', 0],
        null,
      );
      dictionaryCopy.decimalLongitude = get(
        dictionaryCopy,
        ['gps', 1],
        null,
      );
      delete dictionaryCopy.gps;
    }

    const operations = Object.keys(dictionaryCopy).map(
      propertyKey => ({
        op: 'replace',
        path: `/${propertyKey}`,
        value: dictionaryCopy[propertyKey],
      }),
    );

    try {
      setLoading(true);
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

      setError(formatError(patchResponse));
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
    updateProperties,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
