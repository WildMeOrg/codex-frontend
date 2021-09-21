import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useIndividual(individualId) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(null);
  const [individualData, setIndividualData] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setRefreshCount(refreshCount + 1);
  }

  useEffect(
    () => {
      const fetchSightingData = async () => {
        try {
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/individuals/${individualId}`,
            method: 'get',
          });

          const responseStatusCode = get(response, ['status']);
          setStatusCode(responseStatusCode);
          const successful = responseStatusCode === 200;
          if (!successful) setError(formatError(response));

          setIndividualData(get(response, ['data', 'result']));
          setLoading(false);
        } catch (fetchError) {
          const responseStatusCode = get(fetchError, [
            'response',
            'status',
          ]);
          setStatusCode(responseStatusCode);
          console.error(`Error fetching individual ${individualId}`);
          console.error(fetchError);
          setError(formatError(fetchError));
          setLoading(false);
        }
      };

      if (individualId) fetchSightingData();
    },
    [individualId, refreshCount],
  );

  return {
    data: individualData,
    statusCode,
    loading,
    error,
    refresh,
  };
}
