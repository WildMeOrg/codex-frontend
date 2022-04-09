import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get, isEmpty, set } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePatchIndividual from '../../models/individual/usePatchIndividual';
import CustomAlert from '../../components/Alert';
import InputRow from '../../components/fields/edit/InputRow';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';
import Text from '../../components/Text';

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
  const intl = useIntl();

  const {
    updateIndividualProperties,
    loading,
    error: patchIndividualError,
    setError: setPatchIndividualError,
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

  const [formErrors, setFormErrors] = useState([]);

  const showErrorAlert =
    patchIndividualError || formErrors.length > 0;

  function handleClose() {
    setDefaultFieldValues(
      getInitialFormValues(defaultFieldMetadata, 'name'),
    );
    setCustomFieldValues(
      getInitialFormValues(customFieldMetadata, 'id'),
    );
    setPatchIndividualError(null);
    setFormErrors([]);
    onClose();
  }

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={handleClose}
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

        {showErrorAlert && (
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            {formErrors.length > 0 &&
              formErrors.map(formError => (
                <Text key={formError} variant="body2">
                  {formError}
                </Text>
              ))}
            {patchIndividualError && (
              <Text variant="body2">{patchIndividualError}</Text>
            )}
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={handleClose} id="CANCEL" />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            // validation
            const requiredFieldErrors = metadata.reduce(
              (memo, schema) => {
                if (!schema.required) return memo;

                const isFieldEmpty = schema.customField
                  ? !customFieldValues[schema.id]
                  : !defaultFieldValues[schema.name];

                if (isFieldEmpty) {
                  const fieldName = schema.labelId
                    ? intl.formatMessage({ id: schema.labelId })
                    : schema.label;

                  memo.push(
                    intl.formatMessage(
                      { id: 'INCOMPLETE_FIELD' },
                      { fieldName },
                    ),
                  );
                }

                return memo;
              },
              [],
            );

            setFormErrors(requiredFieldErrors);
            if (requiredFieldErrors.length > 0) return;

            // Always include the firstName. If it does not already exist, add it.
            // Otherwise, replace it.
            const firstNameGuid = deriveNameGuid(
              metadata,
              'firstName',
            );
            const firstNameProperty = firstNameGuid
              ? {
                  op: 'replace',
                  value: defaultFieldValues.firstName,
                  guid: firstNameGuid,
                }
              : {
                  op: 'add',
                  value: defaultFieldValues.firstName,
                  context: 'FirstName',
                };

            const names = [firstNameProperty];

            // If there was an adoptionName, update it with whatever the value is now.
            // If there was not an adoptionName, but there is a value now, add it.
            // If an adoptionName did not already exist, don't add it.
            const adoptionNameGuid = deriveNameGuid(
              metadata,
              'adoptionName',
            );
            const adoptionNameFieldValue =
              defaultFieldValues.adoptionName;
            if (adoptionNameGuid) {
              names.push({
                op: 'replace',
                value: adoptionNameFieldValue,
                guid: adoptionNameGuid,
              });
            } else if (adoptionNameFieldValue) {
              names.push({
                op: 'add',
                value: adoptionNameFieldValue,
                context: 'AdoptionName',
              });
            }

            const properties = { sex: defaultFieldValues.sex, names };

            if (!isEmpty(customFieldValues)) {
              properties.customFields = customFieldValues;
            }

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
