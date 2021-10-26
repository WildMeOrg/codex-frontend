import React, { useEffect, useState } from 'react';
import { get, has } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
// import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import UserDeleteDialog from '../../components/dialogs/UserDeleteDialog';
import Button from '../../components/Button';
import InputRow from '../../components/fields/edit/InputRowNew';
import Text from '../../components/Text';
import useGetMe from '../../models/users/useGetMe';
import { useNotificationSettingsSchemas } from './useUserSettingsSchemas';

function getInitialFormValues(schemas, data) {
  return schemas.reduce((memo, field) => {
    const valueKey = get(field, 'name');
    const defaultValue = get(field, 'defaultValue');
    memo[valueKey] = get(data, valueKey, defaultValue);
    return memo;
  }, {});
}

export default function Settings() {
  useDocumentTitle('SETTINGS_AND_PRIVACY');

  const { data, refresh } = useGetMe();

  const [deactivating, setDeactivating] = useState(false);

  const schemas = useNotificationSettingsSchemas();

  const [formValues, setFormValues] = useState({});
  useEffect(
    () => {
      setFormValues(getInitialFormValues(schemas, data));
    },
    [schemas, data],
  );

  console.log(formValues);

  return (
    <MainColumn>
      {deactivating && (
        <UserDeleteDialog
          open={deactivating}
          onClose={() => setDeactivating(false)}
          userData={data}
          refreshUserData={refresh}
          deactivatingSelf
        />
      )}
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
              padding: '8px 24px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {schemas.map(notificationField => {
              const fieldKey = get(notificationField, 'name');
              const fieldValue = get(formValues, fieldKey);
              return (
                <InputRow
                  key={fieldKey}
                  schema={notificationField}
                  loading={!has(formValues, [fieldKey])}
                >
                  <notificationField.editComponent
                    schema={notificationField}
                    value={fieldValue}
                    onChange={() => {
                      setFormValues({
                        ...formValues,
                        [fieldKey]: !fieldValue,
                      });
                    }}
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
            <Button
              id="DEACTIVATE_ACCOUNT"
              style={{ width: 'fit-content' }}
              onClick={() => setDeactivating(true)}
            />
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
