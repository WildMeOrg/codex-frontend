import React, { useEffect, useState } from 'react';
import { get, map, omit, find } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { MailOutline } from '@material-ui/icons';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import AccountBalanceOutlined from '@material-ui/icons/AccountBalanceOutlined';
import PlaceOutlined from '@material-ui/icons/PlaceOutlined';
import CustomAlert from './Alert';
import { useReplaceUserProperties } from '../models/users/usePatchUser';
import { sanitizeTwitterHandle } from '../utils/formatters';
import { intelligentAgentSchema } from '../constants/intelligentAgentSchema';
import InputRow from './fields/edit/InputRow';
import Button from './Button';
import PasswordVerificationAlert from './PasswordVerificationAlert';
import StandardDialog from './StandardDialog';
import EntityHeader from './EntityHeader';
import BigAvatar from './profilePhotos/BigAvatar';
import RequestCollaborationButton from './RequestCollaborationButton';
import Text from './Text';
import UserProfileMetadataWrap from './UserProfileMetadataWrap';

function getInitialFormValues(schema) {
  return schema.reduce((memo, field) => {
    const valueKey = get(field, 'name');
    memo[valueKey] =
      get(field, 'value', get(field, 'defaultValue')) || '';
    return memo;
  }, {});
}

const twitterSchema = find(
  intelligentAgentSchema,
  schema => schema?.platformName === 'twitter',
);
const twitterMetadataKey = twitterSchema?.userMetadataKey;

export default function EditUserMetadata({
  open,
  userId,
  imageGuid,
  imageSrc,
  name,
  refreshUserData,
  userDataLoading,
  communityUsername,
  dateCreated,
  highestRoleLabelId,
  metadata,
  onClose,
}) {
  const {
    mutate: replaceUserProperties,
    loading,
    error,
    clearError,
  } = useReplaceUserProperties();

  const theme = useTheme();

  const [fieldValues, setFieldValues] = useState({});
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setFieldValues(getInitialFormValues(metadata));
  }, [metadata]);

  return (
    <StandardDialog
      PaperProps={{ style: { width: 900 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
    >
      <DialogContent style={{ minWidth: 200 }}>
        <EntityHeader
          name={name}
          editable
          noDivider
          renderAvatar={
            <BigAvatar
              editable
              userId={userId}
              imageGuid={imageGuid}
              imageSrc={imageSrc}
              name={name}
              refreshUserData={refreshUserData}
              userDataLoading={userDataLoading}
            />
          }

        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {communityUsername && (
                <>
                  <Typography variant="body2">
                    {`@${communityUsername}`}
                  </Typography>
                  <div
                    style={{
                      height: '20px',
                      width: '2px',
                      backgroundColor: 'gray',
                      margin: '0 10px',
                    }}
                  />
                </>
              )}

              <Text
                variant="body2"
                domId="selenium-user-since"
                id="USER_SINCE"
                values={{ date: dateCreated }}
              />
            </div>
          </div>
          <Chip
            label={highestRoleLabelId}
            style={{
              marginTop: 14,
              color: theme.palette.common.black,
              backgroundColor: theme.palette.primary.main + '26',
            }}
          />
        </EntityHeader>

        {metadata.map(field => {
          if (!field.editable) return null;
          if (!field.editComponent) return null; // temporary stopgap
          const value = get(fieldValues, field.name, '');

          const fieldProps = field.editComponentProps || {};
          const labelId = get(field, 'labelId');

          return (
            <div
              key="metadata_input_row"
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              {labelId === 'FULL_NAME' && (
                <UserProfileMetadataWrap key="FULL_NAME">
                  <AccountCircleOutlinedIcon
                    fontSize="small"
                    color="inherit"
                  />
                </UserProfileMetadataWrap>
              )}
              {labelId === 'PROFILE_LABEL_EMAIL' && (
                <UserProfileMetadataWrap key="EMAIL">
                  <MailOutline fontSize="small" color="inherit" />
                </UserProfileMetadataWrap>
              )}
              {labelId === 'PROFILE_LABEL_FORUM_ID' && (
                <UserProfileMetadataWrap key="FORUM_ID">
                  <ForumOutlinedIcon
                    fontSize="small"
                    color="inherit"
                  />
                </UserProfileMetadataWrap>
              )}
              {labelId === 'PROFILE_LABEL_AFFILIATION' && (
                <UserProfileMetadataWrap key="AFFILIATION">
                  <AccountBalanceOutlined
                    fontSize="small"
                    color="inherit"
                  />
                </UserProfileMetadataWrap>
              )}
              {labelId === 'PROFILE_LABEL_LOCATION' && (
                <UserProfileMetadataWrap key="LOCATION">
                  <PlaceOutlined fontSize="small" color="inherit" />
                </UserProfileMetadataWrap>
              )}

              <InputRow schema={field} key={field.id || field.name}>
                <field.editComponent
                  schema={field}
                  {...fieldProps}
                  value={value}
                  minimalLabels
                  onChange={newValue => {
                    const newFormValues = {
                      ...fieldValues,
                      [field.name]: newValue,
                    };
                    setFieldValues(newFormValues);
                  }}
                />
              </InputRow>
            </div>
          );
        })}

        {passwordRequired && (
          <PasswordVerificationAlert
            setPassword={setPassword}
            descriptionId="EMAIL_CHANGE_DESCRIPTION"
          />
        )}
        {error && (
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            {error}
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="basic"
          onClick={() => {
            clearError();
            setPasswordRequired(false);
            setPassword('');
            setFieldValues(getInitialFormValues(metadata));
            onClose();
          }}
          id="CANCEL"
        />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            const emailMetadata = metadata.find(
              m => m.name === 'email',
            );
            const oldEmail = get(emailMetadata, 'value', 'no-match');
            const emailChanged =
              get(fieldValues, 'email') !== oldEmail;
            const passwordEntered = password !== '';

            if (emailChanged && !passwordEntered) {
              setPasswordRequired(true);
            } else {
              const patchFieldValues = emailChanged
                ? fieldValues
                : omit(fieldValues, ['email']);
              const patchValues = map(
                patchFieldValues,
                (value, key) => {
                  if (key === twitterMetadataKey) {
                    const sanitizedVal = sanitizeTwitterHandle(value);
                    return {
                      path: `/${key}`,
                      value: sanitizedVal,
                    };
                  }
                  return {
                    path: `/${key}`,
                    value,
                  };
                },
              );
              const response = await replaceUserProperties({
                userGuid: userId,
                properties: patchValues,
                password,
              });
              if (response?.status === 200) {
                clearError();
                setPasswordRequired(false);
                setPassword('');
                onClose();
              }
            }
          }}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
