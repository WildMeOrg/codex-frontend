import { partition } from 'lodash';
import { nestQueries } from '../../utils/elasticSearchUtils';

export default function buildIndividualsQuery(formFilters) {
    const [filters, mustNots] = partition(
        formFilters,
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
    
      return  compositeQuery;
}