import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useKeywords() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  function refresh() {
    setRefreshCount(refreshCount + 1);
  }

  useEffect(
    () => {
      const fetchKeywords = async () => {
        try {
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/keywords/`,
            method: 'get',
          });

          const responseStatusCode = get(response, ['status']);
          setStatusCode(responseStatusCode);
          const successful = responseStatusCode === 200;
          if (!successful) setError(formatError(response));

          setLoading(false);
          setKeywords(get(response, ['data']));
        } catch (fetchError) {
          const responseStatusCode = get(fetchError, [
            'response',
            'status',
          ]);
          setStatusCode(responseStatusCode);
          console.error('Error fetching keywords');
          console.error(fetchError);
          setError(formatError(fetchError));
          setLoading(false);
        }
      };

      fetchKeywords();
    },
    [refreshCount],
  );

  return { keywords, statusCode, loading, error, refresh };
}
