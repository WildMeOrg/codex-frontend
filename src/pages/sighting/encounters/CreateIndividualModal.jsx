import React, { useState } from 'react';
import { get, set, pick } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePostIndividual from '../../../models/individual/usePostIndividual';
import StandardDialog from '../../../components/StandardDialog';
import InputRow from '../../../components/InputRow';
import Button from '../../../components/Button';
import ButtonLink from '../../../components/ButtonLink';
import Alert from '../../../components/Alert';
import Text from '../../../components/Text';
import { defaultIndividualFields } from '../../../constants/individualSchema';

const createFields = defaultIndividualFields.filter(
  f => f.requiredForIndividualCreation,
);

export default function CreateIndividualModal({
  open,
  onClose,
  encounterId,
}) {
  const { loading, error, postIndividual } = usePostIndividual();

  const initialState = createFields.reduce((memo, field) => {
    set(memo, field.name, field.defaultValue);
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);
  const [newIndividualId, setNewIndividualId] = useState(null);

  const onCloseDialog = () => {
    setFormState(initialState);
    setNewIndividualId(null);
    onClose();
  };

  return (
    <StandardDialog
      maxWidth={newIndividualId ? 'sm' : 'xl'}
      titleId={
        newIndividualId
          ? 'NEW_INDIVIDUAL_CREATED'
          : 'CREATE_INDIVIDUAL'
      }
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        {newIndividualId ? (
          <Text id="NEW_INDIVIDUAL_CREATED_DESCRIPTION" />
        ) : (
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
                  value={get(formState, field.name)}
                  onChange={newFieldValue => {
                    const newFormState = {
                      ...set(formState, field.name, newFieldValue),
                    };
                    setFormState(newFormState);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {error && (
          <Alert
            titleId="SERVER_ERROR"
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          display="basic"
          onClick={onCloseDialog}
          id={newIndividualId ? 'CLOSE' : 'CANCEL'}
        />
        {newIndividualId ? (
          <ButtonLink
            id="VIEW_NEW_INDIVIDUAL"
            display="primary"
            href={`/individuals/${newIndividualId}`}
          />
        ) : (
          <Button
            display="primary"
            loading={loading}
            onClick={async () => {
              const individualData = pick(formState, 'names'); // just this for now...
              const newId = await postIndividual(
                individualData,
                encounterId,
              );
              setNewIndividualId(newId);
            }}
            id="CREATE_INDIVIDUAL"
          />
        )}
      </DialogActions>
    </StandardDialog>
  );
}
