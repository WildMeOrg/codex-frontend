import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import Button from '../../components/Button';
import Text from '../../components/Text';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoLetter from '../../components/svg/BaoLetter';

export default function RequestInvitation()
{
  useDocumentTitle('VERIFY_YOUR_ACCOUNT');

  return (
    <SimpleFormPage
      titleId="VERIFY_YOUR_ACCOUNT"
      instructionsId="VERIFY_YOUR_ACCOUNT_DESCRIPTION"
      BaoComponent={BaoLetter}
      baoStyles={{ width: 320 }}
    >
      <Button
        href="/"
        style={{ width: 280, margin: '24px 16px 16px 16px' }}
        display="panel"
        id="RESEND_VERIFICATION_EMAIL"
      />
    </SimpleFormPage>
  );
}
