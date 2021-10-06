import React from 'react';
import { FormattedMessage } from 'react-intl';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import CustomAlert from './Alert';

export default function PasswordVerificationAlert({
  setPassword,
  descriptionId,
  style = {},
}) {
  return (
    <CustomAlert
      severity="info"
      titleId="PASSWORD_VERIFICATION_REQUIRED"
      descriptionId={descriptionId}
      style={{ marginBottom: 20, ...style }}
    >
      <FormControl required style={{ width: 320, marginTop: 8 }}>
        <TextField
          autoComplete="password"
          variant="outlined"
          id="password"
          type="password"
          onChange={e => {
            setPassword(e.target.value);
          }}
          label={<FormattedMessage id="PASSWORD" />}
        />
      </FormControl>
    </CustomAlert>
  );
}
