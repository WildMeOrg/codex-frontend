import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { values } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
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
  const theme = useTheme();
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
            <ExpansionPanel
              key={category.name}
              defaultExpanded={category.name === 'general'}
              style={{
                border: `1px solid ${theme.palette.grey[500]}`,
                boxShadow: 'none',
                margin: '16px 0',
                maxWidth: 600,
                width: '90%',
              }}
              square
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${
                  category.name
                }-filter-panel-content`}
                id={`${category.name}-filter-panel-header`}
              >
                <Typography variant="subtitle1">
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <Hidden xsDown>
                        <Typography
                          style={{
                            margin: '8px 16px 0 0',
                            width: 180,
                            textAlign: 'right',
                          }}
                        >
                          <FormattedMessage id={filter.labelId} />
                        </Typography>
                      </Hidden>
                      <LabeledInput
                        key={`${category.name} - ${filter.name}`}
                        schema={filter}
                        required={filter.required}
                        value={formValues[filter.name]}
                        onChange={value => {
                          setFormValues({
                            ...formValues,
                            [filter.name]: value,
                          });
                        }}
                        width={220}
                      />
                    </div>
                  ))}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </Grid>
      <Grid item style={{ marginTop: 40 }}>
        <Button>Continue</Button>
      </Grid>
    </Grid>
  );
}
