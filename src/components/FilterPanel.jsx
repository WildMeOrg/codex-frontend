import React from 'react';
import { values } from 'lodash-es';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LabeledInput from './LabeledInput';
import Text from './Text';
import OptionTermFilter from './filterFields/OptionTermFilter';
import DateRangeFilter from './filterFields/DateRangeFilter';
import SubstringFilter from './filterFields/SubstringFilter';

export default function FilterPanel({
  categories,
  filters,
  formValues,
  setFormValues,
}) {
  const categoryList = values(categories);

  return (
    <div>
      <Text
        variant="h5"
        style={{ margin: '16px 0 16px 16px' }}
        id="FILTERS"
      />

      <SubstringFilter
        label="NAME"
        description="NAME_DESCRIPTION"
        onChange={query => {
          console.log(query);
        }}
        queryTerms={['alias', 'name', 'id']}
      />
      <DateRangeFilter
        label="LAST_SEEN"
        description="LAST_SEEN_DESCRIPTION"
        onChange={query => {
          console.log(query);
        }}
        queryTerm="lastSeenDate"
      />
      <OptionTermFilter
        label="SEX"
        description="SEX_FILTER_DESCRIPTION"
        onChange={query => {
          console.log(query);
        }}
        queryTerm="gender"
        choices={[
          {
            label: 'Male',
            value: 'male',
          },
          {
            label: 'Female',
            value: 'female',
          },
        ]}
      />
      {categoryList.map(category => {
        const filtersInCategory = filters.filter(
          f => f.category === category.name,
        );

        return (
          <Accordion key={category.name}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${category.name}-filter-panel-content`}
              id={`${category.name}-filter-panel-header`}
            >
              <Text id={category.labelId}>{category.label}</Text>
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {filtersInCategory.map(filter => (
                  <LabeledInput
                    key={`${category.name} - ${filter.name}`}
                    schema={filter}
                    value={formValues[filter.name]}
                    onChange={value => {
                      setFormValues({
                        ...formValues,
                        [filter.name]: value,
                      });
                    }}
                    width={232}
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
