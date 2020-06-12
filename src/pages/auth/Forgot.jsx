import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import InlineButton from '../../components/InlineButton';
import Link from '../../components/Link';
import Shell from './Shell';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');

  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'PASSWORD_RESET' }));

  const titleId = 'PASSWORD_RESET';
  const instructionsId = 'FORGOT_PASSWORD_INSTRUCTIONS';

  if (requestSent) {
    return (
      <Shell titleId={titleId} instructionsId={instructionsId}>
        <Typography
          style={{ padding: '8px 16px 0 16px', maxWidth: 400 }}
        >
          <FormattedMessage id="PASSWORD_RESET_SENT" />
        </Typography>
        <Button
          onClick={() => {
            setRequestSent(false);
          }}
          style={{ width: 280, margin: '24px 16px 16px 16px' }}
          color="secondary"
          variant="contained"
        >
          <FormattedMessage id="TRY_AGAIN" />
        </Button>
      </Shell>
    );
  }

  return (
    <Shell titleId={titleId} instructionsId={instructionsId}>
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, width: 280 }}
      >
        <Grid item>
          <TextInput
            schema={{ labelId: 'EMAIL_ADDRESS' }}
            value={email}
            onChange={newEmail => setEmail(newEmail)}
            variant="outlined"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setRequestSent(true);
              }, 1000);
            }}
            style={{ width: '100%' }}
            color="secondary"
            variant="contained"
            disabled={loading}
          >
            <FormattedMessage id="RESET_PASSWORD" />
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
              <Link href="/login">
                <FormattedMessage id="LOG_IN" />
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
