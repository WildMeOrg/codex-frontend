import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePatchAssetGroupSighting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateProperties = async (agsId, dictionary) => {
    const dictionaryCopy = { ...dictionary };
    console.log('deleteMe dictionaryCopy 2 is: ');
    console.log(dictionaryCopy);
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
    if ('time' in dictionaryCopy) {
      console.log('deleteMe got here d1');
      dictionaryCopy.timeSpecificity = 'time'; // TODO will eventually want this to come form form data
    }

    const operations = Object.keys(dictionaryCopy).map(
      propertyKey => {
        const dictValue = dictionaryCopy[propertyKey];
        // if (propertyKey === 'time')
        // dictValue = dictionaryCopy[propertyKey].replace(
        //   'Z',
        //   '+00:00',
        // );
        // dictValue = '1999-01-01T12:34:56-07:00';
        // TODO this sucks and I hate it but I need to cut off the rabbit hole for now
        return {
          op: 'replace',
          path: `/${propertyKey}`,
          value: dictValue,
        };
      },
    );

    try {
      setLoading(true);
      setError(null);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${agsId}`,
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
    } catch (postError) {
      const backendErrorMessage = get(postError, [
        'response',
        'data',
        'message',
      ]);
      const errorMessage =
        backendErrorMessage || formatError(postError);
      setLoading(false);
      setError(errorMessage);
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
