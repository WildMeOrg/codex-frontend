import { partition } from 'lodash'; // eslint-disable-line import/no-extraneous-dependencies

export default function buildEncountersQuery(formFilters) {
  const [filters, mustNots] = partition(
    formFilters,
    q => q.clause === 'filter',
  );

  const filterQueries = filters.map(f => f.query);
  const mustNotQueries = mustNots.map(f => f.query);
  const compositeQuery = {
    bool: { filter: filterQueries, must_not: mustNotQueries },
  };
  return compositeQuery;
}
