import React from 'react';

import useIndividualSearchSchemas from '../../../models/individual/useIndividualSearchSchemas';
import Text from '../../../components/Text';

function setFilter(newFilter, formFilters, setFormFilters)
{
  const matchingFilterIndex = formFilters.findIndex(
    f => f.filterId === newFilter.filterId,
  );
  if (matchingFilterIndex === -1)
  {
    setFormFilters([...formFilters, newFilter]);
  } else
  {
    const newFormFilters = [...formFilters];
    newFormFilters[matchingFilterIndex] = newFilter;
    setFormFilters(newFormFilters);
  }
}

export default function FilterPanel({
  formFilters,
  setFormFilters,
  updateFilters,
})
{
  const schemas = useIndividualSearchSchemas();

  const handleFilterChange = filter =>
  {
    setFilter(filter, formFilters, setFormFilters);
    updateFilters();
  };
  const clearFilter = filterId =>
  {
    const newFormFilters = formFilters.filter(
      f => f.filterId !== filterId,
    );
    setFormFilters(newFormFilters);
    updateFilters();
  };

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
        {schemas.map(schema => <schema.FilterComponent
          key={schema.id}
          labelId={schema.labelId}
          onChange={handleFilterChange}
          onClearFilter={clearFilter}
          {...schema.filterComponentProps}
        />)}
      </div>
    </div>
  );
}
