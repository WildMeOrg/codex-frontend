import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import projectSchema from '../../constants/projectSchema';

// https://lowrey.me/test-if-a-string-is-alphanumeric-in-javascript/
const isAlphaNumeric = ch => ch.match(/^[a-z0-9]+$/i) !== null;
function filterNonAlphaNumeric(value) {
  const validCharacters = value
    .split('')
    .filter(char => char === ' ' || isAlphaNumeric(char));
  return validCharacters.join('');
}

export default function CreateProject({
  open,
  onClose,
  onCreateProject,
}) {
  const initialState = projectSchema.reduce((memo, field) => {
    memo[field.name] = field.defaultValue;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);
  const closeAndEmptyForm = () => {
    setFormState(initialState);
    onClose();
  };

  function autofillProjectId(e) {
    /* Short circuit to prevent overriding value */
    if (formState.project_id) return null;

    const projectName = e.target.value;
    const modifiedProjectName = filterNonAlphaNumeric(
      projectName.toUpperCase(),
    );
    const words = modifiedProjectName.split(' ');
    if (words.length === 1) {
      setFormState({
        ...formState,
        project_id: words[0].substring(0, 3),
      });
    } else {
      setFormState({
        ...formState,
        project_id: words.map(word => word.substring(0, 1)).join(''),
      });
    }
    return null;
  }

  return (
    <Dialog open={open} onClose={closeAndEmptyForm}>
      <DialogTitle>
        <FormattedMessage id="CREATE_A_PROJECT" />
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          justify="center"
          component="form"
          style={{ maxWidth: 320, marginBottom: 12 }}
        >
          {projectSchema.map(field => {
            const suggestProjectId = field.name === 'name';
            return (
              <Grid item>
                <LabeledInput
                  schema={field}
                  value={formState[field.name]}
                  onBlur={
                    suggestProjectId ? autofillProjectId : undefined
                  }
                  onChange={newFieldValue =>
                    setFormState({
                      ...formState,
                      [field.name]: newFieldValue,
                    })
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={closeAndEmptyForm}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          display="primary"
          onClick={() => onCreateProject(formState)}
        >
          <FormattedMessage id="CREATE" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
