import React, { useState } from 'react';

import useSightingSearchSchemas from '../../models/sighting/useSightingSearchSchemas';
import SearchPage from '../../components/SearchPage';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import SightingsDisplay from '../../components/dataDisplays/SightingsDisplay';

export default function SearchSightings() {
  const [formFilters, setFormFilters] = useState([]);

  // const {
  //   data: searchResults,
  //   hitCount,
  //   loading,
  //   updateFilters,
  // } = useFilterSightings(formFilters, page, rowsPerPage);

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
      <SightingsDisplay sightings={[]} />
    </SearchPage>
  );
}
