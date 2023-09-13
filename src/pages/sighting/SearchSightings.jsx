import React, { useState } from 'react';

import useSightingSearchSchemas from '../../models/sighting/useSightingSearchSchemas';
import useFilterSightings from '../../models/sighting/useFilterSightings';
import SearchPage from '../../components/SearchPage';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import ElasticsearchSightingsDisplay from '../../components/dataDisplays/ElasticsearchSightingsDisplay';
import Paginator from '../../components/dataDisplays/Paginator';

const rowsPerPage = 100;

export default function SearchSightings() {
  const [formFilters, setFormFilters] = useState([]);
  const [searchParams, setSearchParams] = useState({
    limit: rowsPerPage,
    offset: 0,
    sort: 'created',
    reverse: true,
  });

  const { data, loading } = useFilterSightings({
    queries: formFilters,
    params: searchParams,
  });

  const { results: searchResults, resultCount } = data;

  const schemas = useSightingSearchSchemas();

  return (
    <SearchPage
      titleId="EXPLORE_SIGHTINGS"
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
      <ElasticsearchSightingsDisplay
        sightings={searchResults || []}
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
