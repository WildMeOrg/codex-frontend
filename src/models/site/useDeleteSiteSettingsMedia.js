import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import queryKeys from '../../constants/queryKeys';
import { formatError } from '../../utils/formatters';

export default function useDeleteSiteSettingsMedia() {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteSettingsAsset = async data => {
    let okStatus = false;
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/file/${data}`,
        withCredentials: true,
        method: 'delete',
      });
      const statusResponse = get(response, 'status');
      const successful = statusResponse === 204;
      setLoading(false);
      if (successful) {
        queryClient.invalidateQueries(queryKeys.settingsSchema);
        setSuccess(true);
        setError(null);
        okStatus = true;
      } else {
        setError(formatError(response));
        setSuccess(false);
        okStatus = false;
      }
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
      okStatus = false;
    }
    return okStatus;
  };

  return {
    deleteSettingsAsset,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
