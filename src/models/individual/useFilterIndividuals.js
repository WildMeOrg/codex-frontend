import { useEffect, useState } from 'react';
import axios from 'axios';
import { get, partition } from 'lodash-es';
import { formatError } from '../../utils/formatters';
import { nestQueries } from '../../utils/elasticSearchUtils';

export default function useFilterIndividuals(
  queries,
  pageIndex,
  resultsPerPage = 20,
) {
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

          const [filters, mustNots] = partition(
            queries,
            q => q.clause === 'filter',
          );
          const [nestedFilters, normalFilters] = partition(
            filters,
            f => f.nested,
          );
          const [nestedMustNots, normalMustNots] = partition(
            mustNots,
            f => f.nested,
          );

          const normalFilterQueries = normalFilters.map(f => f.query);
          const normalMustNotQueries = normalMustNots.map(
            f => f.query,
          );
          const filterQueriesToNest = nestedFilters.map(f => f.query);
          const mustNotQueriesToNest = nestedMustNots.map(
            f => f.query,
          );

          const nestedFilterQueries = nestQueries(
            'encounters',
            filterQueriesToNest,
          );
          const nestedMustNotQueries = nestQueries(
            'encounters',
            mustNotQueriesToNest,
          );

          const rawResponse = await axios.request({
            url: `${__houston_url__}/api/v1/search/individuals`,
            method: 'post',
            data: {
              from: pageIndex * resultsPerPage,
              size: resultsPerPage,
              query: {
                bool: {
                  filter: [
                    ...normalFilterQueries,
                    ...nestedFilterQueries,
                  ],
                  must_not: [
                    ...normalMustNotQueries,
                    ...nestedMustNotQueries,
                  ],
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
