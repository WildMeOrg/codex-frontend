import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
// import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Button from '../../components/Button';
import InputRow from '../../components/fields/edit/InputRowNew';
import Text from '../../components/Text';
import useGetMe from '../../models/users/useGetMe';
import { useNotificationSettingsSchemas } from './useUserSettingsSchemas';

export default function UserSettings() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'SETTINGS_AND_PRIVACY' }));

  const {
    data,
    loading,
    error,
    refresh,
  } = useGetMe();

  const notificationSettingsSchemas = useNotificationSettingsSchemas();

  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="SETTINGS_AND_PRIVACY"
      />
      <ButtonLink
        href="/"
        style={{ marginTop: 8, width: 'fit-content' }}
        display="back"
        id="RETURN_HOME"
      />
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ paddingBottom: 40 }}
      >
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="NOTIFICATION_SETTINGS"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              id="NEW_USER_ADMIN_MESSAGE"
              style={{ marginBottom: 12 }}
            />
            {notificationSettingsSchemas.map(notificationField => {
              return (
                <InputRow schema={notificationField}>
                  <notificationField.editComponent
                    schema={notificationField}
                    value={false}
                    onChange={value => {}}
                    minimalLabels
                  />
                </InputRow>
              );
            })}
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="ACCOUNT_ACTIONS"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              id="DEACTIVATE_ACCOUNT_WARNING"
              style={{ marginBottom: 12 }}
            />
            <Button id="DEACTIVATE_ACCOUNT" style={{ width: 'fit-content' }} onClick={() => {}} />
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
