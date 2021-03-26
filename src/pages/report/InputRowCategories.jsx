import React from 'react';
import Paper from '@material-ui/core/Paper';

import InputRow from '../../components/InputRow';
import Text from '../../components/Text';

export default function InputRowCategories({
  setFormValues,
  formValues,
  categoryList,
  fieldSchema,
}) {
  return categoryList.map(category => {
    const inputsInCategory = fieldSchema.filter(
      f => f.category === category.name,
    );

    return (
      <div key={category.name}>
        <div style={{ marginLeft: 12 }}>
          <Text
            variant="h6"
            style={{ marginTop: 20 }}
            id={category.labelId}
          />
          {category.descriptionId && (
            <Text
              variant="subtitle2"
              style={{ marginBottom: 12 }}
              id={category.descriptionId}
            />
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
          {inputsInCategory.map(input => (
            <InputRow
              key={`${category.name} - ${input.name}`}
              labelId={input.labelId}
              descriptionId={input.descriptionId}
              required={input.required}
              schema={input}
              value={formValues[input.name]}
              onChange={value => {
                setFormValues({
                  ...formValues,
                  [input.name]: value,
                });
              }}
            />
          ))}
        </Paper>
      </div>
    );
  });
}
