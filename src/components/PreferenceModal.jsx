import React, { useEffect, useState, useMemo } from 'react';
import { get, has } from 'lodash-es';

import useDocumentTitle from '../hooks/useDocumentTitle';
import MainColumn from '../components/MainColumn';
import UserDeleteDialog from '../components/dialogs/UserDeleteDialog';
import Button from '../components/Button';
import InputRow from '../components/fields/edit/InputRow';
import Text from '../components/Text';
import ErrorDialog from '../components/dialogs/ErrorDialog';
import useGetMe from '../models/users/useGetMe';
import { useReplaceUserProperty } from '../models/users/usePatchUser';
import { useNotificationSettingsSchemas } from '../pages/preferences/useUserSettingsSchemas';
import { deriveNotificationPreferences } from '../pages/preferences/deriveNotificationPreferences';
import StandardDialog from '../components/StandardDialog';
import DialogContent from '@material-ui/core/DialogContent';
import MailOutline from '@material-ui/icons/MailOutline';
import EditOutline from '@material-ui/icons/EditOutlined';
import GroupAdd from '@material-ui/icons/GroupAdd';
import CallMerge from '@material-ui/icons/CallMerge';
import UserProfileMetadataWrap from '../components/UserProfileMetadataWrap';



function getInitialFormValues(schemas, data) {
  return schemas.reduce((memo, field) => {
    const valueKey = get(field, 'name');
    const defaultValue = get(field, 'defaultValue');
    memo[valueKey] = get(data, valueKey, defaultValue);
    return memo;
  }, {});
}

export default function Preferences({open, onClose}) {
  useDocumentTitle('PREFERENCES');

  const { data } = useGetMe();

  const [deactivating, setDeactivating] = useState(false);

  const {
    mutate: replaceUserProperty,
    loading,
    error,
    clearError,
  } = useReplaceUserProperty();
  const schemas = useNotificationSettingsSchemas();

  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    const initialValues = getInitialFormValues(schemas, data);

    setFormValues(prevFormValues => ({
      ...initialValues,
      ...prevFormValues,
    }));
  }, [schemas, data]);

  const backendValues = useMemo(
    () => getInitialFormValues(schemas, data),
    [schemas, data],
  );

  return (
    <MainColumn>      
      <StandardDialog
      PaperProps={{ style: { width: 900 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId="PREFERENCES"
    >
      <DialogContent style={{ minWidth: 200 }}>
        <ErrorDialog
          open={Boolean(error)}
          onClose={() => {
            clearError();
          }}
          errorMessage={error}
        />
        {deactivating && (
          <UserDeleteDialog
            open={deactivating}
            onClose={() => setDeactivating(false)}
            userData={data}
            deactivatingSelf
          />
        )}
               
            <Text
              variant="h6"
              style={{ marginTop: 20, marginLeft: 12 }}
              id="NOTIFICATION_SETTINGS"
            />
            
              {schemas.map(notificationField => {
                const fieldKey = get(notificationField, 'name');
                const fieldValue = get(formValues, fieldKey);
                const backendValue = get(backendValues, fieldKey);
                const valueHasChanged = fieldValue !== backendValue;
                const labelId = get(notificationField, 'labelId');

                return (
                  <div style = {{display: 'flex', flexDirection: 'row'}}>
                  {labelId === 'ALL_NOTIFICATION_EMAILS' && 
                    <UserProfileMetadataWrap>
                      <MailOutline fontSize="small" color="inherit" />
                    </UserProfileMetadataWrap>}
                  {labelId === 'COLLABORATION_REQUESTS' && 
                    <UserProfileMetadataWrap>
                      <GroupAdd fontSize="small" color="inherit" />
                    </UserProfileMetadataWrap>}
                  {labelId === 'COLLABORATION_EDIT_REQUESTS' && 
                    <UserProfileMetadataWrap>
                      <EditOutline fontSize="small" color="inherit" />
                    </UserProfileMetadataWrap>}
                  {labelId === 'MERGE_OF_INDIVIDUAL' && 
                    <UserProfileMetadataWrap>
                      <CallMerge fontSize="small" color="inherit" />
                    </UserProfileMetadataWrap>}
                    
                  <>
                  <InputRow
                    key={fieldKey}
                    schema={notificationField}
                    loading={!has(formValues, [fieldKey])}
                  >                    
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
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
                      
                      {valueHasChanged && (
                        <div>
                          <Button
                            size="small"
                            display="primary"
                            id="SAVE"
                            loading={loading}
                            onClick={async () => {
                              const currentChangeValues = {
                                ...backendValues,
                                [fieldKey]: fieldValue,
                              };
                              const newNotificationPreferences =
                                deriveNotificationPreferences(
                                  backendValues,
                                  currentChangeValues,
                                );
                              await replaceUserProperty({
                                userGuid: get(data, 'guid'),
                                path: '/notification_preferences',
                                value: newNotificationPreferences,
                              });
                            }}
                          />
                          <Button
                            size="small"
                            onClick={() => {
                              setFormValues({
                                ...formValues,
                                [fieldKey]: backendValue,
                              });
                            }}
                            style={{ marginLeft: 4 }}
                            id="UNDO"
                          />
                        </div>
                      )}
                    </div>
                  </InputRow>
                  </>
                  </div>
                );
              })}
           
            <Text
              variant="h6"
              style={{ marginTop: 20}}
              id="ACCOUNT_ACTIONS"
            />            
              <Text
                id="DEACTIVATE_ACCOUNT_WARNING"
                style={{ marginBottom: 12 }}
              />
              <Button
                display="secondary"
                id="DEACTIVATE_ACCOUNT"
                style={{ width: 'fit-content', marginBottom: 30 }}
                onClick={() => setDeactivating(true)}
              />            
      </DialogContent>

    </StandardDialog>
    </MainColumn>
  );
}



