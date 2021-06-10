import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useAssetGroup(assetGroupId) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(null);
  const [data, setData] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setRefreshCount(refreshCount + 1);
  }

  useEffect(
    () => {
      const fetchAssetGroupData = async () => {
        try {
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/asset_groups/${assetGroupId}`,
            method: 'get',
          });

          const responseStatusCode = get(response, ['status']);
          setStatusCode(responseStatusCode);
          const successful = responseStatusCode === 200;
          if (!successful) setError(formatError(response));

          setLoading(false);
          setData(get(response, ['data']));
        } catch (fetchError) {
          const responseStatusCode = get(fetchError, [
            'response',
            'status',
          ]);
          setStatusCode(responseStatusCode);
          console.error(`Error fetching asset group ${assetGroupId}`);
          console.error(fetchError);
          setError(formatError(fetchError));
          setLoading(false);
        }
      };

      if (assetGroupId) fetchAssetGroupData();
    },
    [assetGroupId, refreshCount],
  );

  return { data, statusCode, loading, error, refresh };
}
