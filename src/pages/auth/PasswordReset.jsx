import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import useOnEnter from '../../hooks/useOnEnter';
import TextInput from '../../components/inputs/TextInput';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Link from '../../components/Link';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoWaving from '../../components/svg/BaoWaving';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import usePostPasswordReset from '../../models/users/usePostPasswordReset';

export default function PasswordReset() {
  useDocumentTitle('PASSWORD_RESET');
  const { code } = useParams();
  const [passwordInfo, setPasswordInfo] = useState();
  const passwordsMatch =
    passwordInfo?.password &&
    passwordInfo?.password === passwordInfo?.confirmPassword;
  const instructionsId = 'CONFIRM_PASSWORD_INSTRUCTIONS';
  const titleId = 'PASSWORD_RESET';
  const {
    mutate: postPasswordReset,
    error,
    loading,
    clearError,
    success,
    clearSuccess,
  } = usePostPasswordReset();
  const buttonId = 'submitPasswordReset';

  useOnEnter(() => {
    document.querySelector(`#${buttonId}`).click();
  });
  return (
    <SimpleFormPage
      titleId={titleId}
      instructionsId={instructionsId}
      BaoComponent={BaoWaving}
    >
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: '16px 0', width: 280 }}
      >
        <Grid item>
          <TextInput
            secureTextEntry
            schema={{ labelId: 'PASSWORD' }}
            value={passwordInfo?.password}
            onChange={newPassword =>
              setPasswordInfo({
                ...passwordInfo,
                password: newPassword,
              })
            }
            variant="outlined"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <TextInput
            secureTextEntry
            schema={{ labelId: 'CONFIRM_PASSWORD' }}
            value={passwordInfo?.confirmPassword}
            onChange={newConfirmPassword =>
              setPasswordInfo({
                ...passwordInfo,
                confirmPassword: newConfirmPassword,
              })
            }
            variant="outlined"
          />
        </Grid>
        <Grid item style={{ positiion: 'relative' }} />
        <Button
          disabled={!passwordsMatch}
          domId={buttonId}
          style={{ width: '100%' }}
          display="primary"
          loading={loading}
          onClick={async () => {
            await postPasswordReset({
              code,
              password: passwordInfo?.password,
            });
          }}
          id="RESET_PASSWORD"
        />
      </Grid>
      {error && (
        <Alert
          titleId="PASSWORD_RESET_ERROR"
          severity="error"
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          titleId="PASSWORD_RESET_SUCCESS"
          severity="success"
          onClose={clearSuccess}
        >
          <FormattedMessage id="PASSWORD_RESET_SUCCESSFUL" />
          <Link href="/login">
            <FormattedMessage id="RETURN_TO_LOGIN_PAGE" />
          </Link>
        </Alert>
      )}
    </SimpleFormPage>
  );
}
