import React, { useState } from 'react';

import useFilterIndividuals from '../../models/individual/useFilterIndividuals';
import useIndividualSearchSchemas from '../../models/individual/useIndividualSearchSchemas';
import SearchPage from '../../components/SearchPage';
import SearchFilterList from '../../components/SearchFilterList';
import FilterPanel from '../../components/FilterPanel';
import IndividualsDisplay from '../../components/dataDisplays/IndividualsDisplay';
import Paginator from '../../components/dataDisplays/Paginator';

const rowsPerPage = 100;

export default function SearchIndividuals() {
  const [formFilters, setFormFilters] = useState([]);
  const [searchParams, setSearchParams] = useState({
    limit: rowsPerPage,
    offset: 0,
    sort: 'created',
    reverse: true,
  });

  const { data, loading } = useFilterIndividuals({
    queries: formFilters,
    params: searchParams,
  });

  const { results: searchResults, resultCount } = data;

  const schemas = useIndividualSearchSchemas();

  return (
    <SearchPage
      titleId="EXPLORE_INDIVIDUALS"
      filterPanel={
        <FilterPanel
          formFilters={formFilters}
          setFormFilters={setFormFilters}
          schemas={schemas}
        />
      }
      searchFilterList={
        <SearchFilterList
          formFilters={formFilters}
          setFormFilters={setFormFilters}
        />
      }
    >
      <IndividualsDisplay
        individuals={searchResults || []}
        removeColumns={['role']}
        hideFilterSearch
        loading={loading}
        sortExternally
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        dataCount={resultCount}
      />
      <Paginator
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        count={resultCount}
      />
    </SearchPage>
  );
}
