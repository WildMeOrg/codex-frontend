import React, { useState } from 'react';

import useFilterIndividuals from '../../models/individual/useFilterIndividuals';
import useIndividualSearchSchemas from '../../models/individual/useIndividualSearchSchemas';
import SearchPage from '../../components/SearchPage';
import SearchFilterList from '../../components/SearchFilterList';
import FilterPanel from '../../components/FilterPanel';
import IndividualsDisplay from '../../components/dataDisplays/IndividualsDisplay';

const rowsPerPage = 10;

export default function SearchIndividuals() {
  const [page, setPage] = useState(0);
  const [formFilters, setFormFilters] = useState([]);

  const {
    data: searchResults,
    hitCount,
    loading,
    updateFilters,
  } = useFilterIndividuals(formFilters, page, rowsPerPage);

  const schemas = useIndividualSearchSchemas();

  return (
    <SearchPage
      titleId="EXPLORE_INDIVIDUALS"
      filterPanel={
        <FilterPanel
          formFilters={formFilters}
          setFormFilters={setFormFilters}
          updateFilters={updateFilters}
          schemas={schemas}
        />
      }
      searchFilterList={
        <SearchFilterList
          formFilters={formFilters}
          setFormFilters={setFormFilters}
          updateFilters={updateFilters}
        />
      }
    >
      <IndividualsDisplay
        individuals={searchResults || []}
        hideFilterSearch
        paginated
        page={page}
        onChangePage={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        loading={loading}
        hitCount={hitCount}
      />
    </SearchPage>
  );
}
