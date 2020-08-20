import React from 'react';
import { FormattedMessage } from 'react-intl';
import { values } from 'lodash-es';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LabeledInput from './LabeledInput';

export default function FilterPanel({
  categories,
  filters,
  formValues,
  setFormValues,
}) {
  const categoryList = values(categories);

  return (
    <div>
      <Typography variant="h5" style={{ margin: '16px 0 16px 16px' }}>
        <FormattedMessage id="FILTERS" />
      </Typography>
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
              <Typography>
                {category.labelId ? (
                  <FormattedMessage id={category.labelId} />
                ) : (
                  category.label
                )}
              </Typography>
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
