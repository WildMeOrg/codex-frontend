import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import CustomAlert from '../../components/Alert';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useLogin from '../../models/auth/useLogin';
import Link from '../../components/Link';
import Text from '../../components/Text';
import Button from '../../components/Button';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoWaving from '../../components/svg/BaoWaving';

const buttonId = 'submitLogin';

export default function Login({ showBanner, redirect = '/' }) {
  const { authenticate, error, setError, loading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useDocumentTitle('LOG_IN');

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
    <SimpleFormPage
      titleId="WELCOME_BACK"
      instructionsId="LOG_IN"
      BaoComponent={BaoWaving}
    >
      {showBanner && (
        <CustomAlert
          style={{ marginTop: 12 }}
          severity="warning"
          descriptionId="MUST_LOG_IN"
        />
      )}

      <form>
        <Grid
          container
          spacing={2}
          direction="column"
          style={{ padding: '8px 0 16px 0', width: 280 }}
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
                  setError(null);
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
          <Grid item>
            <FormControl required style={{ marginBottom: 4 }}>
              <FormControlLabel
                control={<Switch name="remember" />}
                label={<FormattedMessage id="REMEMBER_ME" />}
              />
            </FormControl>
          </Grid>
          {error && (
            <CustomAlert severity="error">{error}</CustomAlert>
          )}
          <Grid item style={{ position: 'relative' }}>
            <Button
              domId={buttonId}
              loading={loading}
              onClick={() => {
                authenticate(email, password, redirect);
              }}
              display="primary"
              id="LOG_IN"
            />
          </Grid>
        </Grid>
        <Typography>
          <Link href="/forgot">
            <Text
              variant="subtitle2"
              component="span"
              id="FORGOT_QUESTION"
            />
          </Link>
          <span style={{ margin: '0 4px' }}> | </span>
          <Link href="/request">
            <Text
              variant="subtitle2"
              component="span"
              id="REQUEST_INVITE"
            />
          </Link>
        </Typography>
      </form>
    </SimpleFormPage>
  );
}
