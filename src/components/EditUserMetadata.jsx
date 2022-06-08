import React, { useEffect, useState } from 'react';
import { get, map, omit, find, filter } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import CustomAlert from './Alert';
import { useReplaceUserProperties } from '../models/users/usePatchUser';
import { sanitizeTwitterHandle } from '../utils/formatters';
import { intelligentAgentSchema } from '../constants/intelligentAgentSchema';
import InputRow from './fields/edit/InputRow';
import Button from './Button';
import PasswordVerificationAlert from './PasswordVerificationAlert';
import StandardDialog from './StandardDialog';

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
  metadata,
  onClose,
}) {
  const {
    mutate: replaceUserProperties,
    loading,
    error,
    clearError,
  } = useReplaceUserProperties();

  const [fieldValues, setFieldValues] = useState({});
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(
    () => {
      // const safeMetadata = filter(
      //   metadata,
      //   datum => Object.keys(datum).length > 1,
      // );
      // setFieldValues(getInitialFormValues(safeMetadata));
      console.log('deleteMe metadata being set is: ');
      console.log(metadata);
      setFieldValues(getInitialFormValues(metadata));
    },
    [metadata],
  );

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId="EDIT_USER_METADATA"
    >
      <DialogContent style={{ minWidth: 200 }}>
        {metadata.map(field => {
          if (!field.editable) return null;
          if (!field.editComponent) return null; // temporary stopgap
          const value = get(fieldValues, field.name, '');

          const fieldProps = field.editComponentProps || {};

          return (
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
