import React, { useEffect, useState } from 'react';
import { get, set } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePostIndividual from '../../../models/individual/usePostIndividual';
import useIndividualFieldSchemas from '../../../models/individual/useIndividualFieldSchemas';
import StandardDialog from '../../../components/StandardDialog';
import InputRow from '../../../components/fields/edit/InputRowNew';
import Button from '../../../components/Button';
import ButtonLink from '../../../components/ButtonLink';
import Alert from '../../../components/Alert';
import Text from '../../../components/Text';

function calculateInitialState(schemas) {
  if (!schemas) return {};
  return schemas.reduce((memo, field) => {
    set(memo, field.name, field.defaultValue);
    return memo;
  }, {});
}

export default function CreateIndividualModal({
  open,
  onClose,
  encounterId,
}) {
  const { loading, error, postIndividual } = usePostIndividual();

  const [formState, setFormState] = useState({});

  const [newIndividualId, setNewIndividualId] = useState(null);
  const fieldSchemas = useIndividualFieldSchemas();
  const createFieldSchemas = fieldSchemas.filter(
    f => f.requiredForIndividualCreation,
  );

  useEffect(
    () => {
      const initialState = calculateInitialState(fieldSchemas);
      setFormState(initialState);
    },
    [fieldSchemas],
  );

  const onCloseDialog = () => {
    setFormState(calculateInitialState(fieldSchemas));
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
            justifyContent="center"
            component="form"
            direction="column"
          >
            {createFieldSchemas.map(schema => (
              <Grid item key={schema.name}>
                <InputRow schema={schema}>
                  <schema.editComponent
                    schema={schema}
                    value={get(formState, schema.name)}
                    onChange={newFieldValue => {
                      const newFormState = {
                        ...set(formState, schema.name, newFieldValue),
                      };
                      setFormState(newFormState);
                    }}
                  />
                </InputRow>
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
              const defaultName = formState?.defaultName;
              const nickname = formState?.nickname;
              const names = [
                {
                  context: 'defaultName',
                  value: defaultName,
                },
              ];
              if (nickname)
                names.push({
                  context: 'nickname',
                  value: nickname,
                });
              const individualData = {
                names,
              };
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
