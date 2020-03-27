import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LabeledInput from './LabeledInput';

export default function({
  visible,
  onClose,
  fieldValues,
  fieldSchema,
}) {
  const initialState = fieldValues.reduce((memo, field) => {
    memo[field.name] = field.value;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage
          id="EDIT_PROFILE"
          defaultMessage="Edit Profile"
        />
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          justify="center"
          style={{ maxWidth: 320 }}
        >
          {fieldValues.map(fieldData => {
            const schema = fieldSchema.find(
              candidateSchema =>
                candidateSchema.name === fieldData.name,
            );
            return (
              <Grid item key={fieldData.name}>
                <LabeledInput
                  schema={schema}
                  value={formState[fieldData.name]}
                  onChange={e => {
                    setFormState({
                      ...formState,
                      [fieldData.name]: e.target.value,
                    });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions style={{ marginTop: 32 }}>
        <Button
          onClick={() => {
            setFormState(initialState);
            onClose();
          }}
          color="primary"
        >
          <FormattedMessage id="CANCEL" defaultMessage="Cancel" />
        </Button>
        <Button
          onClick={() => {
            // submit data and wait for response...
            onClose();
          }}
          color="primary"
          autoFocus
        >
          <FormattedMessage id="CONFIRM" defaultMessage="Confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
