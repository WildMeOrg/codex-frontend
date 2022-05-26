import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import TextInput from '../../components/inputs/TextInput';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoWaving from '../../components/svg/BaoWaving';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import usePostPasswordReset from '../../models/users/usePostPasswordReset';

export default function PasswordReset() {
  useDocumentTitle('PASSWORD_RESET');
  const { code } = useParams();
  const [passwordInfo, setPasswordInfo] = useState();
  const passwordsMatch =
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
  console.log('deleteMe code is: ');
  console.log(code);
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
          style={{ width: '100ﬁ' }}
          display="primary"
          loading={loading}
          onClick={async () => {
            const response = await postPasswordReset({
              code,
              password: passwordInfo?.password,
            });
            console.log('deleteMe response from password reset is: ');
            console.log(response);
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
          severity="error"
          onClose={clearSuccess}
        >
          <FormattedMessage id="PASSWORD_RESET_SUCCESSFUL" />
        </Alert>
      )}
    </SimpleFormPage>
  );
}
