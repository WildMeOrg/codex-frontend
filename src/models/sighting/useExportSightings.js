import { get, partition } from 'lodash-es';

import useFetch from '../../hooks/useFetch';
import { getSightingExportQueryKey } from '../../constants/queryKeys';


export default function useExportSightings({ queries, params = {}, enabled = true }) {
  const [filters, mustNots] = partition(
    queries,
    q => q.clause === 'filter',
  );

  const filterQueries = filters.map(f => f.query);
  const mustNotQueries = mustNots.map(f => f.query);

  const compositeQuery = {
    bool: { filter: filterQueries, must_not: mustNotQueries },
  };

  return useFetch({
    method: 'post',
    queryKey: getSightingExportQueryKey(queries, params),
    url: '/sightings/export',
    responseType: 'blob',
    data: compositeQuery,
    params: {
      limit: 20,
      offset: 0,
      sort: 'created',
      reverse: false,
      ...params,
    },
    dataAccessor: result => {
      const resultCountString = get(result, [
        'data',
        'headers',
        'x-total-count',
      ]);
      return {
        resultCount: parseInt(resultCountString, 10),
        results: get(result, ['data', 'data']),
      };
    },
    queryOptions: {
      retry: 2,
      enabled: enabled,
    },
  });  
  
}
