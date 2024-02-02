import React, { useState } from 'react';

import useEncounterSearchSchemas from '../../../models/encounter/useEncounterSearchSchemas';
import useFilterEncounters from '../../../models/encounter/useFilterEncounters';
import SearchPage from '../../../components/SearchPage';
import FilterPanel from '../../../components/FilterPanel';
import SearchFilterList from '../../../components/SearchFilterList';
import ElasticsearchEncountersDisplay from '../../../components/dataDisplays/ElasticsearchEncountersDisplay';
import Paginator from '../../../components/dataDisplays/Paginator';

const rowsPerPage = 100;

export default function SearchAnimals() {
  const [formFilters, setFormFilters] = useState([]);
  const [searchParams, setSearchParams] = useState({
    limit: rowsPerPage,
    offset: 0,
    sort: 'created',
    reverse: true,
  });

  const { data, loading } = useFilterEncounters({
    queries: formFilters,
    params: searchParams,
  });

  const { results: searchResults, resultCount } = data;

  const schemas = useEncounterSearchSchemas();

  return (
    <SearchPage
      titleId="EXPLORE_ANIMALS"
      filterPanel={
        <FilterPanel
          formFilters={formFilters}
          setFormFilters={setFormFilters}
          updateFilters={Function.prototype}
          schemas={schemas}
        />
      }
      searchFilterList={
        <SearchFilterList
          formFilters={formFilters}
          setFormFilters={setFormFilters}
          updateFilters={Function.prototype}
        />
      }
    >
      <ElasticsearchEncountersDisplay
        encounters={searchResults || []}
        loading={loading}
        sortExternally
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        dataCount={resultCount}
        formFilters={formFilters}
      />
      <Paginator
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        count={resultCount}
      />
    </SearchPage>
  );
}
