import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useAssetGroupSighting(assetGroupSightingId) {
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
      const fetchAssetGroupSightingData = async () => {
        try {
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/asset_groups/sighting/as_sighting/${assetGroupSightingId}`,
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
          console.error(
            `Error fetching asset group sighting ${assetGroupSightingId}`,
          );
          console.error(fetchError);
          setError(formatError(fetchError));
          setLoading(false);
        }
      };

      if (assetGroupSightingId) fetchAssetGroupSightingData();
    },
    [assetGroupSightingId, refreshCount],
  );

  return { data, statusCode, loading, error, refresh };
}
