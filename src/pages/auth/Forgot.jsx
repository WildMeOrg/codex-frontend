import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import Link from '../../components/Link';
import Button from '../../components/Button';
import Text from '../../components/Text';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoConfused from '../../components/svg/BaoConfused';
import usePostPasswordResetEmail from '../../models/users/usePostPasswordResetEmail';

export default function Forgot() {
  const [email, setEmail] = useState('');
  // const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  // const [error, setError] = useState('');
  const {
    mutate: postPasswordResetEmail,
    error,
    loading,
    clearError,
    success,
    clearSuccess,
  } = usePostPasswordResetEmail();

  useDocumentTitle('PASSWORD_RESET');

  const titleId = 'PASSWORD_RESET';
  const instructionsId = 'FORGOT_PASSWORD_INSTRUCTIONS';

  if (requestSent) {
    return (
      <SimpleFormPage
        titleId={titleId}
        instructionsId={instructionsId}
        BaoComponent={BaoConfused}
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
          id="TRY_AGAIN"
        />
      </SimpleFormPage>
    );
  }

  return (
    <SimpleFormPage
      titleId={titleId}
      instructionsId={instructionsId}
      BaoComponent={BaoConfused}
    >
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
            onClick={async () => {
              const response = await postPasswordResetEmail({
                email,
              });
              if (response?.status === 200) setRequestSent(true);
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
            <Link href="/login">
              <Text
                variant="subtitle2"
                component="span"
                id="LOG_IN"
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
        </Grid>
      </Grid>
    </SimpleFormPage>
  );
}
