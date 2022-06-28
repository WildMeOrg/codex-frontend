import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePatchEncounter from '../../../models/encounter/usePatchEncounter';
import usePatchAgsEncounter from '../../../models/encounter/usePatchAgsEncounter';
import CustomAlert from '../../../components/Alert';
import InputRow from '../../../components/fields/edit/InputRow';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';

function getInitialFormValues(schema, fieldKey) {
  return schema.reduce((memo, field) => {
    const valueKey = get(field, fieldKey);
    memo[valueKey] = get(
      field,
      'value',
      get(field, 'defaultValue', null),
    );
    return memo;
  }, {});
}

export default function EditEncounterMetadata({
  open,
  sightingId,
  encounterId,
  metadata = [],
  onClose,
  refreshSightingData,
  pending = true,
}) {
  const intl = useIntl();

  const {
    updateProperties: updateEncounterProperties,
    loading: encounterLoading,
    error: encounterError,
    setError: setEncounterError,
  } = usePatchEncounter();

  const {
    updateProperties: updateAgsProperties,
    loading: agsLoading,
    error: agsError,
    setError: setAgsError,
  } = usePatchAgsEncounter();

  const loading = pending ? agsLoading : encounterLoading;
  const patchError = pending ? agsError : encounterError;
  const setPatchError = pending ? setAgsError : setEncounterError;

  const [defaultFieldValues, setDefaultFieldValues] = useState({});
  const [customFieldValues, setCustomFieldValues] = useState({});
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    const defaultFieldMetadata = metadata.filter(
      field => !field.customField,
    );
    const customFieldMetadata = metadata.filter(
      field => field.customField,
    );
    setDefaultFieldValues(
      getInitialFormValues(defaultFieldMetadata, 'name'),
    );
    setCustomFieldValues(
      getInitialFormValues(customFieldMetadata, 'id'),
    );
  }, [get(metadata, 'length')]);

  const showErrorAlert = patchError || formErrors.length > 0;

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId="EDIT_ENCOUNTER_METADATA"
    >
      <DialogContent style={{ minWidth: 200 }}>
        {metadata.map(field => {
          if (!field.editable) return null;
          if (!field.editComponent) return null; // temporary stopgap
          const value = field.customField
            ? customFieldValues[field.id]
            : defaultFieldValues[field.name];

          const fieldProps = field.editComponentProps || {};

          return (
            <InputRow schema={field} key={field.id || field.name}>
              <field.editComponent
                schema={field}
                {...fieldProps}
                minimalLabels
                value={value}
                onChange={newValue => {
                  if (field.customField) {
                    const newFormValues = {
                      ...customFieldValues,
                      [field.id]: newValue,
                    };
                    setCustomFieldValues(newFormValues);
                  } else {
                    const newFormValues = {
                      ...defaultFieldValues,
                      [field.name]: newValue,
                    };
                    setDefaultFieldValues(newFormValues);
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
            {patchError && <Text variant="body2">{patchError}</Text>}
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="basic"
          onClick={() => {
            setPatchError(null);
            setFormErrors([]);
            onClose();
          }}
          id="CANCEL"
        />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            let successfulUpdate = false;

            // validation
            const requiredFieldErrors = metadata.reduce(
              (memo, schema) => {
                if (!schema?.required) return memo;

                const isEmpty = schema.customField
                  ? !customFieldValues[schema.id]
                  : !defaultFieldValues[schema.name];

                if (isEmpty) {
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

            const properties = {
              ...defaultFieldValues,
              customFields: customFieldValues,
            };

            if (pending) {
              successfulUpdate = await updateAgsProperties(
                sightingId,
                encounterId,
                properties,
              );
            } else {
              successfulUpdate = await updateEncounterProperties(
                encounterId,
                properties,
              );
            }
            if (successfulUpdate) {
              refreshSightingData();
              onClose();
            }
          }}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
