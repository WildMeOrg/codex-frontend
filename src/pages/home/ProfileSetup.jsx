import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import useOnEnter from '../../hooks/useOnEnter';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useReplaceUserProperties } from '../../models/users/usePatchUser';
import CustomAlert from '../../components/Alert';
import Text from '../../components/Text';
import Button from '../../components/Button';
import BaoWaving from '../../components/svg/BaoWaving';
import SimpleFormPage from '../../components/SimpleFormPage';

const buttonId = 'saveProfile';

export default function ProfileSetup({ userData }) {
  const [noNameError, setNoNameError] = useState(false);
  const [name, setName] = useState('');

  const {
    mutate: replaceUserProperties,
    loading: replaceLoading,
    error: replaceError,
  } = useReplaceUserProperties();

  useDocumentTitle('SET_UP_PROFILE');

  async function saveProfile() {
    if (name) {
      const properties = [
        {
          path: '/full_name',
          value: name,
        },
      ];
      await replaceUserProperties({
        userGuid: get(userData, 'guid'),
        properties,
      });
    } else {
      setNoNameError(true);
    }
  }

  useOnEnter(saveProfile);

  return (
    <SimpleFormPage
      titleId="SET_UP_PROFILE"
      instructionsId="SET_UP_PROFILE_INSTRUCTIONS"
      BaoComponent={BaoWaving}
    >
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
              onChange={e =>
              {
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
            disabled={replaceLoading || name === ''}
          />
        </Grid>
      </Grid>
    </SimpleFormPage>
  );
}
