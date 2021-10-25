import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import ButtonLink from '../../components/ButtonLink';
import Button from '../../components/Button';
import Text from '../../components/Text';
import SimpleFormPage from '../../components/SimpleFormPage';

export default function RequestInvitation() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');

  useDocumentTitle('REQUEST_INVITE');

  const titleId = 'REQUEST_INVITE';
  const instructionsId = 'REQUEST_INVITATION_INSTRUCTIONS';

  if (requestSent) {
    return (
      <SimpleFormPage titleId={titleId} instructionsId="REQUEST_SENT">
        <ButtonLink
          href="/"
          style={{ width: 280, margin: '24px 16px 16px 16px' }}
          display="primary"
        >
          <FormattedMessage id="RETURN_HOME" />
        </ButtonLink>
      </SimpleFormPage>
    );
  }

  return (
    <SimpleFormPage titleId={titleId} instructionsId={instructionsId}>
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: '16px 0', width: 280 }}
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
            display="primary"
            loading={loading}
          >
            <FormattedMessage id="SEND_REQUEST" />
          </Button>
        </Grid>
        {error && (
          <Text
            variant="caption"
            color="error"
            style={{ paddingLeft: 8 }}
          >
            {error}
          </Text>
        )}
      </Grid>
    </SimpleFormPage>
  );
}
