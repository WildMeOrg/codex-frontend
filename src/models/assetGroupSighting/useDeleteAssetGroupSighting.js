import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useDeleteAssetGroupSighting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteAssetGroupSighting = async assetGroupSightingId => {
    try {
      setLoading(true);
      const deleteResponse = await axios({
        url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
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
    deleteAssetGroupSighting,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
