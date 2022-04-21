import { partition } from 'lodash-es';

import useFetch from '../../hooks/useFetch';
import { getSightingFilterQueryKey } from '../../constants/queryKeys';

export default function useFilterSightings({
  queries,
  page,
  rowsPerPage,
}) {
  const [filters, mustNots] = partition(
    queries,
    q => q.clause === 'filter',
  );

  const filterQueries = filters.map(f => f.query);
  const mustNotQueries = mustNots.map(f => f.query);

  const compositeQuery = {
    bool: {
      filter: filterQueries,
      must_not: mustNotQueries,
    },
  };

  return useFetch({
    method: 'post',
    queryKey: getSightingFilterQueryKey(queries, page, rowsPerPage),
    url: '/sightings/search',
    data: compositeQuery,
    queryOptions: {
      retry: 2,
    },
  });
}
