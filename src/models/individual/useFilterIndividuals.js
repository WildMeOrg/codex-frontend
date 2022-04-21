import { partition } from 'lodash-es';

import useFetch from '../../hooks/useFetch';
import { nestQueries } from '../../utils/elasticSearchUtils';
import { getIndividualFilterQueryKey } from '../../constants/queryKeys';

export default function useFilterIndividuals({
  queries,
  page,
  rowsPerPage,
}) {
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
  const normalMustNotQueries = normalMustNots.map(f => f.query);
  const filterQueriesToNest = nestedFilters.map(f => f.query);
  const mustNotQueriesToNest = nestedMustNots.map(f => f.query);

  const nestedFilterQueries = nestQueries(
    'encounters',
    filterQueriesToNest,
  );
  const nestedMustNotQueries = nestQueries(
    'encounters',
    mustNotQueriesToNest,
  );

  const compositeQuery = {
    bool: {
      filter: [...normalFilterQueries, ...nestedFilterQueries],
      must_not: [...normalMustNotQueries, ...nestedMustNotQueries],
    },
  };

  return useFetch({
    method: 'post',
    queryKey: getIndividualFilterQueryKey(queries, page, rowsPerPage),
    url: '/individuals/search',
    data: compositeQuery,
    queryOptions: {
      retry: 2,
    },
  });
}
