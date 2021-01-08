import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../components/MainColumn';
import Button from '../../components/Button';

import useCreateAdminUser from '../../models/setup/useCreateAdminUser';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const buttonId = 'createAdminUser';

export default function AdminUserLogin() {
  const {
    authenticate,
    error,
    setError,
    loading,
  } = useCreateAdminUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'CODEX_INITIALIZED' }));

  function onKeyUp(e) {
    if (e.key === 'Enter') {
      document.querySelector(`#${buttonId}`).click();
      e.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <MainColumn>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3">
            Login with your new account
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            First step is to create an admin user.
          </Typography>
        </Grid>
      </Grid>
      <form>
        <Grid
          container
          spacing={2}
          direction="column"
          style={{ padding: 16, width: 280 }}
        >
          <Grid item>
            <FormControl
              required
              style={{ width: '100%', marginBottom: 4 }}
            >
              <TextField
                autoComplete="username"
                variant="outlined"
                id="email"
                onChange={e => {
                  setEmail(e.target.value);
                  // setError(null);
                }}
                label={<FormattedMessage id="EMAIL_ADDRESS" />}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: '100%', marginBottom: 4 }}
            >
              <TextField
                autoComplete="password"
                variant="outlined"
                id="password"
                type="password"
                onChange={e => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                label={<FormattedMessage id="PASSWORD" />}
              />
            </FormControl>
          </Grid>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid item style={{ position: 'relative' }}>
            <Button
              id={buttonId}
              loading={loading}
              onClick={() => {
                authenticate(email, password);
              }}
              display="primary"
            >
              <FormattedMessage id="CREATE_USER" />
            </Button>
          </Grid>
        </Grid>
      </form>
    </MainColumn>
  );
}
