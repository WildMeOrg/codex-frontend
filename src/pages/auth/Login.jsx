import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Alert from '@material-ui/lab/Alert';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useLogin from '../../models/auth/useLogin';
import InlineButton from '../../components/InlineButton';
import Link from '../../components/Link';
import Button from '../../components/Button';
import Shell from './Shell';

const formId = 'loginform';

export default function Login({ showBanner, redirect = '/' }) {
  const authenticate = useLogin(formId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const intl = useIntl();

  useDocumentTitle(intl.formatMessage({ id: 'LOG_IN' }));

  return (
    <Shell
      titleId="WELCOME_BACK"
      instructionsId="LOG_IN_INSTRUCTIONS"
    >
      {showBanner && <Alert severity="warning"><FormattedMessage id="MUST_LOG_IN" /></Alert> }

      <form
        action={`http://localhost:5000/login?next=${redirect}`}
        method="POST"
        id={formId}
      >
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
                label={<FormattedMessage id="PASSWORD" />}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: 220, marginBottom: 4 }}
            >
              <FormControlLabel
                control={<Switch name="remember" />}
                label={<FormattedMessage id="REMEMBER_ME" />}
              />
            </FormControl>
          </Grid>
          <Grid item style={{ position: 'relative' }}>
            <Button
              onClick={() =>
                authenticate('jason@wildme.org', 'test1234')
              }
              display="primary"
            >
              <FormattedMessage id="LOG_IN" />
            </Button>
          </Grid>
          {error && (
            <Typography
              variant="caption"
              color="error"
              style={{ paddingLeft: 8 }}
            >
              {error}
            </Typography>
          )}
          <Grid item>
            <Typography>
              <InlineButton>
                <Link href="/forgot">
                  <FormattedMessage id="FORGOT_QUESTION" />
                </Link>
              </InlineButton>
              <span style={{ margin: '0 12px' }}> | </span>
              <InlineButton>
                <Link href="/request">
                  <FormattedMessage id="REQUEST_INVITE" />
                </Link>
              </InlineButton>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Shell>
  );
}
