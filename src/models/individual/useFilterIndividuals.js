import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

const resultsPerPage = 5;

export default function useFilterIndividuals(filters, pageIndex) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [response, setResponse] = useState(null);
  const [hitCount, setHitCount] = useState(null);

  useEffect(
    () => {
      const filterIndividuals = async () => {
        try {
          setLoading(true);
          const rawResponse = await axios.request({
            url: `${__houston_url__}/api/v1/search/individuals`,
            method: 'post',
            data: {
              from: pageIndex * resultsPerPage,
              size: resultsPerPage,
              query: {
                bool: {
                  filter: filters,
                },
              },
            },
          });

          setLoading(false);
          const responseStatusCode = get(rawResponse, ['status']);
          setStatusCode(responseStatusCode);
          const successful = responseStatusCode === 200;
          if (!successful) setError(formatError(response));

          const hits = get(rawResponse, ['data', 'hits', 'hits'], []);
          const hitSources = hits.map(hit => get(hit, '_source'));
          const count = get(rawResponse, [
            'data',
            'hits',
            'total',
            'value',
          ]);
          setHitCount(count);
          setResponse(hitSources);
        } catch (fetchError) {
          const responseStatusCode = get(fetchError, [
            'response',
            'status',
          ]);
          setStatusCode(responseStatusCode);
          console.error('Error querying individuals');
          console.error(fetchError);
          setError(formatError(fetchError));
          setLoading(false);
        }
      };
      filterIndividuals();
    },
    [refreshCount, pageIndex],
  );

  function updateFilters() {
    setRefreshCount(refreshCount + 1);
  }

  return {
    data: response,
    hitCount,
    statusCode,
    loading,
    error,
    updateFilters,
  };
}
