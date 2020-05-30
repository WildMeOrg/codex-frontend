import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextInput from '../../components/inputs/TextInput';
import InlineButton from '../../components/InlineButton';
import Shell from './Shell';

export default function Login({ callback }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <Shell
      titleId="WELCOME_BACK"
      instructionsId="LOG_IN_INSTRUCTIONS"
    >
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, width: 280 }}
      >
        <Grid item>
          <TextInput
            schema={{ labelId: 'USERNAME_OR_EMAIL' }}
            value={username}
            onChange={newUsername => setUsername(newUsername)}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextInput
            schema={{ labelId: 'PASSWORD' }}
            value={password}
            onChange={newPassword => setPassword(newPassword)}
            variant="outlined"
            type="password"
            autoComplete="current-password"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                if (callback) {
                  callback();
                } else {
                  console.log('looks good!'); // redirect home
                }
              }, 1000);
            }}
            style={{ width: '100%' }}
            color="secondary"
            variant="contained"
            disabled={loading}
          >
            <FormattedMessage id="LOG_IN" />
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: -12,
                marginTop: -12,
              }}
            />
          )}
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
              <FormattedMessage id="FORGOT_QUESTION" />
            </InlineButton>
            <span style={{ margin: '0 12px' }}> | </span>
            <InlineButton>
              <FormattedMessage id="REQUEST_INVITE" />
            </InlineButton>
          </Typography>
        </Grid>
      </Grid>
    </Shell>
  );
}
