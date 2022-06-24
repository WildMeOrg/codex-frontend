import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoLetter from '../../components/svg/BaoLetter';
import useResendVerificationEmail from '../../models/auth/useResendVerificationEmail';

export default function RequestInvitation() {
  useDocumentTitle('VERIFY_YOUR_ACCOUNT');

  const {
    mutate: resendVerificationEmail,
    loading,
    error,
    success,
    clearSuccess,
  } = useResendVerificationEmail();

  return (
    <SimpleFormPage
      titleId="VERIFY_YOUR_ACCOUNT"
      instructionsId="VERIFY_YOUR_ACCOUNT_DESCRIPTION"
      BaoComponent={BaoLetter}
      baoStyles={{ width: 320 }}
    >
      {error && (
        <Alert
          style={{ marginTop: 16 }}
          severity="error"
          titleId="SERVER_ERROR"
        >
          {error}
        </Alert>
      )}
      <Button
        loading={loading}
        disabled={loading || success}
        style={{ width: 280, margin: '24px 16px 16px 16px' }}
        display="panel"
        id="RESEND_VERIFICATION_EMAIL"
        onClick={resendVerificationEmail}
      />
      {success && (
        <Alert
          titleId="EMAIL_SENT"
          descriptionId="VERIFICATION_EMAIL_SENT_DESCRIPTION"
          onClose={clearSuccess}
        />
      )}
    </SimpleFormPage>
  );
}
