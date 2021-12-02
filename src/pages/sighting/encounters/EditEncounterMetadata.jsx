import React, { useEffect, useState } from 'react';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePatchEncounter from '../../../models/encounter/usePatchEncounter';
import CustomAlert from '../../../components/Alert';
import InputRow from '../../../components/fields/edit/InputRowNew';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';

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
  // sightingId,
  encounterId,
  metadata = [],
  onClose,
  refreshSightingData,
}) {
  const {
    updateProperties,
    loading,
    error,
    setError,
  } = usePatchEncounter();

  const [defaultFieldValues, setDefaultFieldValues] = useState({});
  const [customFieldValues, setCustomFieldValues] = useState({});

  useEffect(
    () => {
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
    },
    [get(metadata, 'length')],
  );

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

        {error && (
          <CustomAlert
            severity="error"
            titleId="SUBMISSION_ERROR"
            description={error}
          />
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
            const successfulUpdate = await updateProperties(
              encounterId,
              defaultFieldValues,
            );
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
