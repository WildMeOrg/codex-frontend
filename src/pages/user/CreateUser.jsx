import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import LabeledInput from '../../components/LabeledInput';
import userSchema from '../../constants/userSchema';

const schemas = userSchema.filter(field => field.adminOnly);

export default function CreateUser({ open, onClose, onCreateUser }) {
  const initialState = schemas.reduce((memo, field) => {
    memo[field.name] = field.defaultValue;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="CREATE_USER" />
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          justify="center"
          style={{ maxWidth: 320, marginTop: 12, marginBottom: 12 }}
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
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button onClick={() => onCreateUser(formState)}>
          <FormattedMessage id="CREATE_USER" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
