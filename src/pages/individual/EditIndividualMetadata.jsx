import React, { useState } from 'react';
import { get, set } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePatchIndividual from '../../models/individual/usePatchIndividual';
import CustomAlert from '../../components/Alert';
import InputRow from '../../components/fields/edit/InputRow';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';

function deriveNameGuid(metadata, schemaName) {
  const foundSchema = metadata.find(
    schema => schema.name === schemaName,
  );
  return foundSchema?.nameGuid;
}

function getInitialFormValues(schema, fieldKey) {
  return schema.reduce((memo, field) => {
    const valueKey = get(field, fieldKey);
    const value = get(
      field,
      'value',
      get(field, 'defaultValue', null),
    );
    memo = set(memo, valueKey, value);
    return memo;
  }, {});
}

export default function EditIndividualMetadata({
  open,
  individualId,
  metadata,
  onClose,
  refreshIndividualData,
}) {
  const {
    updateIndividualProperties,
    loading,
    error,
    setError,
  } = usePatchIndividual();

  // hotfix //
  metadata = metadata || [];
  // hotfix //

  const defaultFieldMetadata = metadata.filter(
    field => !field.customField,
  );
  const customFieldMetadata = metadata.filter(
    field => field.customField,
  );

  const [defaultFieldValues, setDefaultFieldValues] = useState(
    getInitialFormValues(defaultFieldMetadata, 'name'),
  );

  const [customFieldValues, setCustomFieldValues] = useState(
    getInitialFormValues(customFieldMetadata, 'id'),
  );

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId="EDIT_INDIVIDUAL_METADATA"
    >
      <DialogContent style={{ minWidth: 200 }}>
        {metadata.map(field => {
          if (!field.editable) return null;
          if (!field.editComponent) return null; // temporary stopgap
          const value = field.customField
            ? get(customFieldValues, field.id)
            : get(defaultFieldValues, field.name);

          const fieldProps = field.editComponentProps || {};

          return (
            <InputRow schema={field} key={field.id || field.name}>
              <field.editComponent
                schema={field}
                {...fieldProps}
                value={value}
                minimalLabels
                onChange={newValue => {
                  if (field.customField) {
                    const newFormValues = {
                      ...customFieldValues,
                      [field.id]: newValue,
                    };
                    setCustomFieldValues(newFormValues);
                  } else {
                    const newFormDefaultValues = {
                      ...set(
                        defaultFieldValues,
                        field.name,
                        newValue,
                      ),
                    };
                    setDefaultFieldValues(newFormDefaultValues);
                  }
                }}
              />
            </InputRow>
          );
        })}

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
            setError(null);
            onClose();
          }}
          id="CANCEL"
        />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            const names = [];
            // Always include the defaultName. If it does not already exist, add it.
            // Otherwise, replace it.
            const defaultNameGuid = deriveNameGuid(
              metadata,
              'defaultName',
            );
            const defaultNameProperty = defaultNameGuid
              ? {
                  op: 'replace',
                  value: defaultFieldValues.defaultName,
                  guid: defaultNameGuid,
                }
              : {
                  op: 'add',
                  value: defaultFieldValues.defaultName,
                  context: 'defaultName',
                };
            names.push(defaultNameProperty);

            // If there was a nickname, update it with whatever the value is now.
            // If there was not a nickname, but there is a value now, add it.
            // If a nickname did not already exist, don't add it.
            const nicknameGuid = deriveNameGuid(metadata, 'nickname');
            const nicknameFieldValue = defaultFieldValues.nickname;
            if (nicknameGuid) {
              names.push({
                op: 'replace',
                value: nicknameFieldValue,
                guid: nicknameGuid,
              });
            } else if (nicknameFieldValue) {
              names.push({
                op: 'add',
                value: nicknameFieldValue,
                context: 'nickname',
              });
            }

            const properties = { sex: defaultFieldValues.sex, names };
            const successfulUpdate = await updateIndividualProperties(
              individualId,
              properties,
            );
            if (successfulUpdate) {
              refreshIndividualData();
              onClose();
            }
          }}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
