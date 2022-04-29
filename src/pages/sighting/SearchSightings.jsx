import React, { useState } from 'react';

import useSightingSearchSchemas from '../../models/sighting/useSightingSearchSchemas';
import useFilterSightings from '../../models/sighting/useFilterSightings';
import SearchPage from '../../components/SearchPage';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import SightingsDisplay from '../../components/dataDisplays/SightingsDisplay';

const rowsPerPage = 10;

export default function SearchSightings() {
  const [page, setPage] = useState(0);
  const [formFilters, setFormFilters] = useState([]);

  const { data: searchResults, loading } = useFilterSightings({
    queries: formFilters,
    page,
    rowsPerPage,
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
    </SearchPage>
  );
}
