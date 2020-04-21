import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { values } from 'lodash-es';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  selectEncounterSchema,
  selectEncounterCategories,
} from '../../modules/encounters/selectors';
import LabeledInput from '../../components/LabeledInput';

export default function StandardReport() {
  const categories = useSelector(selectEncounterCategories);
  const schema = useSelector(selectEncounterSchema);
  const categoryList = values(categories);

  const [formValues, setFormValues] = useState(
    schema.reduce((memo, filter) => {
      memo[filter.name] = filter.defaultValue;
      return memo;
    }, {}),
  );

  return (
    <Grid container direction="column">
      <Grid item>
        {categoryList.map(category => {
          const inputsInCategory = schema.filter(
            f => f.category === category.name,
          );

          return (
            <ExpansionPanel key={category.name}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${
                  category.name
                }-filter-panel-content`}
                id={`${category.name}-filter-panel-header`}
              >
                <Typography>
                  {category.labelId ? (
                    <FormattedMessage id={category.labelId} />
                  ) : (
                    category.label
                  )}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {inputsInCategory.map(filter => (
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
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </Grid>
      <Grid item>
        <Button>Continue</Button>
      </Grid>
    </Grid>
  );
}
