import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import usePatchUser from '../../models/users/usePatchUser';
import CustomAlert from '../../components/Alert';
import Text from '../../components/Text';
import Button from '../../components/Button';
import SimpleFormPage from '../../components/SimpleFormPage';

const buttonId = 'saveProfile';

export default function ProfileSetup({ userData, refreshUserData }) {
  const [noNameError, setNoNameError] = useState(false);
  const [name, setName] = useState('');

  const intl = useIntl();

  const {
    replaceUserProperties,
    loading: replaceLoading,
    error: replaceError,
  } = usePatchUser(get(userData, 'guid'));

  useDocumentTitle(intl.formatMessage({ id: 'SET_UP_PROFILE' }));

  function onKeyUp(e) {
    if (e.key === 'Enter') {
      document.querySelector(`#${buttonId}`).click();
      e.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  async function saveProfile() {
    if (name) {
      const properties = [
        {
          path: '/full_name',
          value: name,
        },
      ];
      const successful = await replaceUserProperties(properties);
      if (successful) refreshUserData();
    } else {
      setNoNameError(true);
    }
  }
  return (
    <SimpleFormPage
      titleId="SET_UP_PROFILE"
      instructionsId="SET_UP_PROFILE_INSTRUCTIONS"
    >
      <form>
        <Grid
          container
          spacing={2}
          direction="column"
          style={{ padding: '16px 0', width: 280 }}
        >
          <Grid item>
            <FormControl
              required
              style={{ width: '100%', marginBottom: 4 }}
            >
              <TextField
                variant="outlined"
                id="name"
                error={noNameError}
                onChange={e => {
                  setName(e.target.value);
                  if (noNameError) setNoNameError(false);
                }}
                label={<FormattedMessage id="FULL_NAME_REQUIRED" />}
                helperText={
                  noNameError ? (
                    <FormattedMessage id="FULL_NAME_IS_REQUIRED" />
                  ) : (
                    undefined
                  )
                }
              />
              <Text
                style={{ margin: '8px 4px 0 4px' }}
                variant="caption"
                id="FULL_NAME_DESCRIPTION"
              />
            </FormControl>
          </Grid>
          {replaceError && (
            <CustomAlert
              severity="error"
              description={replaceError}
            />
          )}
          <Grid item style={{ position: 'relative' }}>
            <Button
              domId={buttonId}
              loading={replaceLoading}
              onClick={saveProfile}
              display="primary"
              id="SAVE_PROFILE"
            />
          </Grid>
        </Grid>
      </form>
    </SimpleFormPage>
  );
}
