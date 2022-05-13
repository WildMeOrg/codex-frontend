import React, { useState } from 'react';

import useSightingSearchSchemas from '../../models/sighting/useSightingSearchSchemas';
import useFilterSightings from '../../models/sighting/useFilterSightings';
import SearchPage from '../../components/SearchPage';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import SightingsDisplay from '../../components/dataDisplays/SightingsDisplay';
import Paginator from '../../components/dataDisplays/Paginator';

const rowsPerPage = 100;

export default function SearchSightings() {
  const [formFilters, setFormFilters] = useState([]);
  const [searchParams, setSearchParams] = useState({
    limit: rowsPerPage,
    offset: 0,
  });

  const { data: searchResults, loading } = useFilterSightings({
    queries: formFilters,
    params: searchParams,
  });

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
      <SightingsDisplay
        sightings={searchResults || []}
        loading={loading}
      />
      <Paginator
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </SearchPage>
  );
}
