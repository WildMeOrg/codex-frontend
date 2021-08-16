import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';

import usePostIndividual from '../../models/individual/usePostIndividual';
import CreatePage from '../../components/CreatePage';
import InputRow from '../../components/InputRow';
import { defaultIndividualFields } from '../../constants/individualSchema';

const createFields = defaultIndividualFields.filter(
  f => f.requiredForIndividualCreation,
);

export default function CreateIndividual() {
  const { postIndividual } = usePostIndividual();

  const initialState = createFields.reduce((memo, field) => {
    memo[field.name] = field.defaultValue;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);

  return (
    <CreatePage
      ctaId="CREATE_INDIVIDUAL"
      onCreate={async () => {
        const newIndividual = await postIndividual();
        console.log(newIndividual);
      }}
    >
      <Grid
        container
        spacing={2}
        justify="center"
        component="form"
        direction="column"
      >
        {createFields.map(field => (
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
