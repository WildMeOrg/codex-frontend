import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import CreatePage from '../../components/CreatePage';
import InputRow from '../../components/InputRow';
import userSchema from '../../constants/userSchema';

const schemas = userSchema.filter(
  field => field.requiredForUserCreation,
);

export default function CreateUser() {
  const initialState = schemas.reduce((memo, field) => {
    memo[field.name] = field.defaultValue;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);

  return (
    <CreatePage
      ctaId="CREATE_USER"
      onCreate={() => console.log(formState)}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        component="form"
        direction="column"
      >
        {schemas.map(field => (
          <Grid item key={field.label || field.labelId}>
            <InputRow
              label={field.label}
              labelId={field.labelId}
              description={field.description}
              descriptionId={field.descriptionId}
              required={field.required}
              schema={field}
              value={formState[field.name]}
              onChange={newFieldValue =>
                setFormState({
                  ...formState,
                  [field.name]: newFieldValue,
                })
              }
            />
          </Grid>
        ))}
      </Grid>
    </CreatePage>
  );
}
