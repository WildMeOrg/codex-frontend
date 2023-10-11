import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TextInput from '../../components/inputs/TextInput';
import ButtonLink from '../../components/ButtonLink';
import Button from '../../components/Button';
import SimpleFormPage from '../../components/SimpleFormPage';
import BaoLetter from '../../components/svg/BaoLetter';
import usePostRequestInvitation from '../../models/users/usePostRequestInvitation';
import useSiteSettings from '../../models/site/useSiteSettings';
import get from 'lodash/get';
import { useEffect } from 'react';
import Text from '../../components/Text';

export default function RequestInvitation() {
  const {
    mutate: postRequestInvitation,
    error: errorRequest,
    loading: loadingRequest,
  } = usePostRequestInvitation();
  const { data: siteSettingsData } = useSiteSettings();
  const recaptchaPublicKey = get(siteSettingsData, [
    'recaptchaPublicKey',
    'value',
  ]);
  
  useEffect(() => {
    if (
      recaptchaPublicKey &&
      !document.getElementById('recaptcha-script')
    ) {
      const recaptchaApiUrl = `https://www.google.com/recaptcha/api.js?render=${recaptchaPublicKey}`;
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = recaptchaApiUrl;
      recaptchaScript.id = 'recaptcha-script';
      document.head.appendChild(recaptchaScript);
    }
  }, [recaptchaPublicKey]);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  useDocumentTitle('REQUEST_INVITE');

  const titleId = 'REQUEST_INVITE';
  const instructionsId = 'REQUEST_INVITATION_INSTRUCTIONS';

  if (requestSent) {
    return (
      <SimpleFormPage
        titleId={titleId}
        instructionsId="REQUEST_SENT"
        BaoComponent={BaoLetter}
        baoStyles={{ width: 320 }}
      >
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
    <SimpleFormPage
      titleId={titleId}
      instructionsId={instructionsId}
      BaoComponent={BaoLetter}
      baoStyles={{ width: 320 }}
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
            required
          />
        </Grid>
        <Grid item>
          <TextInput
            schema={{ labelId: 'YOUR_NAME' }}
            value={name}
            onChange={newName => setName(newName)}
            variant="outlined"
            required
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
            onClick={async () => {
              let token = null;
              if (window.grecaptcha) {
                const grecaptchaReady = new Promise(resolve => {
                  window.grecaptcha.ready(() => {
                    resolve();
                  });
                });

                await grecaptchaReady;

                token = await window.grecaptcha.execute(
                  recaptchaPublicKey,
                  { action: 'submit' },
                );
                
              }
              const response = await postRequestInvitation({email, name, message, token});
              if (response?.status === 200){
                setTimeout(() => {
                  setRequestSent(true);
                }, 1000);
              }            
            }}
            disabled={!email.trim() || !name.trim() }  
            style={{ width: '100%' }}
            display="primary"
            loading={loadingRequest}
            id="SEND_REQUEST"
          />
        </Grid>
        <Grid item>
          {errorRequest && (
          <Text
            variant="caption"
            color="error"
            style={{ paddingLeft: 8 }}
          >
            {errorRequest}
          </Text>
        )}
        </Grid>
        
      </Grid>
    </SimpleFormPage>
  );
}
