import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import ButtonLink from '../../components/ButtonLink';
import Shell from './Shell';

export default function RequestInvitation() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');

  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'REQUEST_INVITE' }));

  const titleId = 'REQUEST_INVITE';
  const instructionsId = 'REQUEST_INVITATION_INSTRUCTIONS';

  if (requestSent) {
    return (
      <Shell titleId={titleId} instructionsId="REQUEST_SENT">
        <ButtonLink
          href="/"
          style={{ width: 280, margin: '24px 16px 16px 16px' }}
          color="secondary"
          variant="contained"
        >
          <FormattedMessage id="RETURN_HOME" />
        </ButtonLink>
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
        <Grid item>
          <TextInput
            schema={{ labelId: 'YOUR_NAME' }}
            value={name}
            onChange={newName => setName(newName)}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextInput
            schema={{
              labelId: 'MESSAGE_FOR_ADMINISTRATORS',
              fieldType: 'longstring',
            }}
            value={message}
            onChange={newMessage => setMessage(newMessage)}
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
            <FormattedMessage id="SEND_REQUEST" />
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
      </Grid>
    </Shell>
  );
}
