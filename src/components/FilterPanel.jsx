import React from 'react';

import Text from './Text';

function setFilter(newFilter, formFilters, setFormFilters) {
  const matchingFilterIndex = formFilters.findIndex(
    f => f.filterId === newFilter.filterId,
  );
  if (matchingFilterIndex === -1) {
    setFormFilters([...formFilters, newFilter]);
  } else {
    const newFormFilters = [...formFilters];
    newFormFilters[matchingFilterIndex] = newFilter;
    setFormFilters(newFormFilters);
  }
}

export default function FilterPanel({
  schemas,
  formFilters,
  setFormFilters,
  updateFilters,
}) {
  const handleFilterChange = filter => {
    setFilter(filter, formFilters, setFormFilters);
    updateFilters();
  };
  const clearFilter = filterId => {
    const newFormFilters = formFilters.filter(
      f => f.filterId !== filterId,
    );
    setFormFilters(newFormFilters);
    updateFilters();
  };

  const safeSchemas = schemas || [];

  return (
    <div>
      <Text
        variant="h5"
        style={{ margin: '16px 0 16px 16px' }}
        id="FILTERS"
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 16px 16px',
        }}
      >
        {safeSchemas.map(schema => (
          <schema.FilterComponent
            key={schema.id}
            labelId={schema.labelId}
            onChange={handleFilterChange}
            onClearFilter={clearFilter}
            {...schema.filterComponentProps}
          />
        ))}
      </div>
    </div>
  );
}
