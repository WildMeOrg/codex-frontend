import React from 'react';
import { get } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import InputRow from '../../components/InputRow';
import Text from '../../components/Text';

export default function FieldCollections({
  setFormValues,
  formValues,
  categories,
  fieldSchema,
  fieldKey = 'name',
}) {
  const categoryList = Object.values(categories);

  return categoryList.map(category => {
    const inputsInCategory = fieldSchema.filter(
      f => f.category === category.name || f.category === category.id,
    );

    return (
      <Grid item key={category.name || category.id}>
        <div style={{ marginLeft: 12 }}>
          <Text
            variant="h6"
            style={{ marginTop: 20 }}
            id={category.labelId}
          >
            {category.label}
          </Text>
          {category.descriptionId && (
            <Text
              variant="subtitle2"
              style={{ marginBottom: 12 }}
              id={category.descriptionId}
            >
              {category.description}
            </Text>
          )}
        </div>
        <Paper
          elevation={2}
          style={{
            marginTop: 12,
            marginBottom: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0px 12px 20px 12px',
          }}
        >
          {inputsInCategory.map(input => {
            const valueKey = get(input, fieldKey);

            return (
              <InputRow
                key={`${category.name} - ${input.name}`}
                labelId={input.labelId}
                label={input.label}
                descriptionId={input.descriptionId}
                description={input.description}
                required={input.required}
                schema={input}
                value={formValues[valueKey]}
                onChange={value => {
                  setFormValues({
                    ...formValues,
                    [valueKey]: value,
                  });
                }}
              />
            );
          })}
        </Paper>
      </Grid>
    );
  });
}
