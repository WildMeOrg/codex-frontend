import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../../components/Button';
import LabeledInput from '../../components/LabeledInput';
import StandardDialog from '../../components/StandardDialog';
import userSchema from '../../constants/userSchema';

const schemas = userSchema.filter(
  field => field.requiredForUserCreation,
);

export default function CreateUser({ open, onClose, onCreateUser }) {
  const initialState = schemas.reduce((memo, field) => {
    memo[field.name] = field.defaultValue;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);
  const closeAndEmptyForm = () => {
    setFormState(initialState);
    onClose();
  };

  return (
    <StandardDialog
      open={open}
      onClose={closeAndEmptyForm}
      titleId="CREATE_USER"
    >
      <DialogContent>
        <Grid
          container
          spacing={2}
          justify="center"
          component="form"
          style={{ maxWidth: 320, marginBottom: 12 }}
        >
          {schemas.map(field => (
            <Grid item>
              <LabeledInput
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
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={closeAndEmptyForm}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          display="primary"
          onClick={() => onCreateUser(formState)}
        >
          <FormattedMessage id="CREATE_USER" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
