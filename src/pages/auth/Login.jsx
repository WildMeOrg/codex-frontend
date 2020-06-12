import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { selectLoginRedirect } from '../../modules/app/selectors';
import { toggleAuthenticated } from '../../modules/app/actions';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import InlineButton from '../../components/InlineButton';
import Link from '../../components/Link';
import Shell from './Shell';

export default function Login({ callback }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const intl = useIntl();
  const history = useHistory();

  const loginRedirect = useSelector(selectLoginRedirect);
  useDocumentTitle(intl.formatMessage({ id: 'LOG_IN' }));

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
                }

                dispatch(toggleAuthenticated());
                history.push(loginRedirect);
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
    </Shell>
  );
}
