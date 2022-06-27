import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

import Alert from '../../components/Alert';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';
import PasswordVerificationAlert from '../../components/PasswordVerificationAlert';
import { useReplaceUserProperties } from '../../models/users/usePatchUser';
import roleSchema from './constants/roleSchema';

const validRoles = roleSchema.filter(role => role.id !== 'is_staff');

export default function UserEditDialog({ open, onClose, userData }) {
  const [formValues, setFormValues] = useState({});
  const [touched, setTouched] = useState(false);
  const [password, setPassword] = useState('');

  const {
    mutate: replaceUserProperties,
    loading,
    error,
  } = useReplaceUserProperties();

  function cleanupAndClose() {
    setTouched(false);
    setFormValues({});
    setPassword('');
    onClose();
  }

  async function saveProperties() {
    const properties = Object.keys(formValues).map(propertyId => ({
      path: `/${propertyId}`,
      value: formValues[propertyId],
    }));

    const result = await replaceUserProperties({
      userGuid: get(userData, 'guid'),
      properties,
      password,
    });

    if (result?.status === 200) cleanupAndClose();
  }

  return (
    <StandardDialog
      open={open}
      onClose={cleanupAndClose}
      titleId="EDIT_USER"
      maxWidth="xs"
    >
      <div style={{ padding: '12px 24px' }}>
        <FormControl required style={{ width: 320 }}>
          <TextField
            id="email"
            value={formValues.email || get(userData, 'email', '')}
            onChange={e => {
              setTouched(true);
              setFormValues({
                ...formValues,
                email: e.target.value,
              });
            }}
            label={<FormattedMessage id="EMAIL_ADDRESS" />}
          />
        </FormControl>
        <FormControl required style={{ width: 320, marginTop: 28 }}>
          <TextField
            id="full_name"
            value={
              formValues.full_name || get(userData, 'full_name', '')
            }
            onChange={e => {
              setFormValues({
                ...formValues,
                full_name: e.target.value,
              });
            }}
            label={<FormattedMessage id="FULL_NAME" />}
          />
        </FormControl>
        <FormControl component="fieldset" style={{ marginTop: 28 }}>
          <FormLabel component="legend">
            <FormattedMessage id="ROLE" />
          </FormLabel>
          <FormGroup row>
            {validRoles.map(role => {
              const userDataChecked = get(userData, role.id, false);
              const formDataChecked = get(
                formValues,
                role.id,
                undefined,
              );
              const checked =
                formDataChecked === undefined
                  ? userDataChecked
                  : formDataChecked;

              return (
                <FormControlLabel
                  key={role.id}
                  style={{
                    width: 180,
                  }}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() => {
                        setTouched(true);
                        setFormValues({
                          ...formValues,
                          [role.id]: !checked,
                        });
                      }}
                      name={role.id}
                    />
                  }
                  label={<FormattedMessage id={role.titleId} />}
                />
              );
            })}
          </FormGroup>
        </FormControl>
        {touched ? (
          <PasswordVerificationAlert
            setPassword={setPassword}
            descriptionId="SENSITIVE_USER_DATA_CHANGE_DESCRIPTION"
          />
        ) : null}
        {error && (
          <Alert severity="error" titleId="SERVER_ERROR">
            {error}
          </Alert>
        )}
      </div>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="primary"
          onClick={saveProperties}
          loading={loading}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
