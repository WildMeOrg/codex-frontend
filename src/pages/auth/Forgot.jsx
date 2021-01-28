import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import InlineButton from '../../components/InlineButton';
import Link from '../../components/Link';
import Button from '../../components/Button';
import Text from '../../components/Text';
import SimpleFormPage from '../../components/SimpleFormPage';

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
      <SimpleFormPage
        titleId={titleId}
        instructionsId={instructionsId}
      >
        <Text
          style={{ padding: '8px 16px 0 16px', maxWidth: 400 }}
          id="PASSWORD_RESET_SENT"
        />
        <Button
          onClick={() => {
            setRequestSent(false);
          }}
          style={{ width: 280, margin: '24px 16px 16px 16px' }}
          display="primary"
        >
          <FormattedMessage id="TRY_AGAIN" />
        </Button>
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
            <FormattedMessage id="RESET_PASSWORD" />
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
    </SimpleFormPage>
  );
}
