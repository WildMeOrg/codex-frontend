import React, { useState } from 'react';

import useFilterIndividuals from '../../models/individual/useFilterIndividuals';
import useIndividualSearchSchemas from '../../models/individual/useIndividualSearchSchemas';
import SearchPage from '../../components/SearchPage';
import SearchFilterList from '../../components/SearchFilterList';
import FilterPanel from '../../components/FilterPanel';
import IndividualsDisplay from '../../components/dataDisplays/IndividualsDisplay';
import Paginator from '../../components/dataDisplays/Paginator';

const rowsPerPage = 2;

export default function SearchIndividuals() {
  const [formFilters, setFormFilters] = useState([]);
  const [searchParams, setSearchParams] = useState({
    limit: rowsPerPage,
    offset: 0,
  });

  const { data: searchResults, loading } = useFilterIndividuals({
    queries: formFilters,
    params: searchParams,
  });

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
        hideFilterSearch
        loading={loading}
      />
      <Paginator
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </SearchPage>
  );
}
