import React, { Fragment, useState } from 'react';

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
}) {
  const [selectedChoices, setSelectedChoices] = useState({});
  const handleFilterChange = filter => {
    if(filter.selectedChoice) {
      setSelectedChoices({
        ...selectedChoices,
        [filter.filterId]: filter.selectedChoice,
      });
    }
    setFilter(filter, formFilters, setFormFilters);
  };
  const clearFilter = filterId => {
    const newFormFilters = formFilters.filter(
      f => f.filterId !== filterId,
    );
    setFormFilters(newFormFilters);
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
        {safeSchemas.map(schema => {
          if(schema.dependency) {

            const dependencyChioce = selectedChoices[schema.dependency];
            if(dependencyChioce) {
              let choices = [];
              switch(schema.id) {
                case 'relationshipRoles':
                  choices = dependencyChioce.roles?.map(data => {
                    return {
                      label: data.label,
                      value: data.guid
                    }
                  }) || [];
                  break;
              }
              const componentProps = {
                ...schema.filterComponentProps,
                choices,
              };
              return (
                <schema.FilterComponent
                    key={`${schema.id}-${selectedChoices[schema.dependency]?.value || ''}`}
                    labelId={schema.labelId}
                    onChange={handleFilterChange}
                    onClearFilter={clearFilter}
                    {...componentProps}
                  />                
              )
            } else {
              return <Fragment key={`${schema.id}-${selectedChoices[schema.dependency]?.value || ''}`} />;
            }
          }
          return (
            <schema.FilterComponent
              key={schema.id}
              labelId={schema.labelId}
              onChange={handleFilterChange}
              onClearFilter={clearFilter}
              {...schema.filterComponentProps}
            />
          );
        })}
      </div>
    </div>
  );
}