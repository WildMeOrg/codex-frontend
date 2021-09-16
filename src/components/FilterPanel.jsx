import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Text from './Text';
import OptionTermFilter from './filterFields/OptionTermFilter';
import DateRangeFilter from './filterFields/DateRangeFilter';
import SubstringFilter from './filterFields/SubstringFilter';
import PointDistanceFilter from './filterFields/PointDistanceFilter';

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
        <SubstringFilter
          labelId="INDIVIDUAL_NAME"
          onChange={handleFilterChange}
          queryTerms={['alias', 'name', 'id']}
          filterId="name"
        />
        <SubstringFilter
          labelId="SPECIES"
          onChange={handleFilterChange}
          queryTerms={['taxonomy']}
          filterId="species"
          style={{ marginTop: 4 }}
        />
        <PointDistanceFilter
          nested
          labelId="DISTANCE_FROM_POINT"
          queryTerm="encounters.point"
          onChange={handleFilterChange}
          filterId="geodistance"
          style={{ marginTop: 20 }}
        />
        <OptionTermFilter
          labelId="SEX"
          onChange={handleFilterChange}
          onClearFilter={clearFilter}
          queryTerm="sex"
          filterId="sex"
          choices={[
            {
              label: 'Male',
              value: 'male',
            },
            {
              label: 'Female',
              value: 'female',
            },
            {
              label: 'Either',
              value: '',
            },
          ]}
          style={{ marginTop: 4 }}
        />
        <OptionTermFilter
          nested
          labelId="HAS_ANNOTATIONS"
          onChange={handleFilterChange}
          onClearFilter={clearFilter}
          queryTerm="encounters.has_annotation"
          filterId="annotation"
          queryType="term"
          choices={[
            {
              label: 'Yes',
              value: 'yes',
              queryValue: true,
            },
            {
              label: 'No',
              value: 'no',
              queryValue: true,
              clause: 'must_not',
            },
            {
              label: 'Either',
              value: '',
            },
          ]}
          style={{ marginTop: 4 }}
        />
      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="time-filter-panel-content"
          id="time-filter-panel-header"
        >
          <Text id="TIME" />
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DateRangeFilter
              labelId="SIGHTING_DATE_RANGE"
              onChange={handleFilterChange}
              queryTerm="last_sighting"
              filterId="last_sighting"
            />
            <DateRangeFilter
              labelId="BIRTH_DATE_RANGE"
              onChange={handleFilterChange}
              queryTerm="birth"
              filterId="birth"
            />
            <DateRangeFilter
              labelId="DEATH_DATE_RANGE"
              onChange={handleFilterChange}
              queryTerm="death"
              filterId="death"
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
