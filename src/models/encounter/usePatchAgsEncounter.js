import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePatchAgsEncounter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateProperties = async (
    assetGroupSightingId,
    encounterId,
    dictionary,
  ) => {
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

    // delete dictionaryCopy.taxonomy;

    const operations = [
      {
        op: 'replace',
        path: `${assetGroupSightingId}/encounter/${encounterId}`,
        value: dictionaryCopy,
      },
    ];

    // const operations = [
    //   {
    //     op: 'replace',
    //     path: `/encounter/${encounterId}`,
    //     value: dictionaryCopy,
    //   },
    // ];

    try {
      setLoading(true);
      setError(null);
      const patchResponse = await axios({
        // url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
        url: `${__houston_url__}/api/v1/asset_groups/a2414177-a4ee-43a2-89bb-579a12de3693`,
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
