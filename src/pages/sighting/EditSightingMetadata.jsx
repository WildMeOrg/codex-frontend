import React, { useEffect, useState } from 'react';
import { get, isEmpty } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import CustomAlert from '../../components/Alert';
import usePatchSighting from '../../models/sighting/usePatchSighting';
import usePatchAGS from '../../models/assetGroupSighting/usePatchAGS';
import InputRow from '../../components/fields/edit/InputRow';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';

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

export default function EditSightingMetadata({
  open,
  sightingId,
  metadata,
  onClose,
  pending,
}) {
  const {
    mutate: updateSightingProperties,
    loading: sightingLoading,
    error: sightingError,
    clearError: clearSightingError,
  } = usePatchSighting();

  const {
    mutate: updateAgsProperties,
    loading: agsLoading,
    error: agsError,
    clearError: clearAgsError,
  } = usePatchAGS();

  const error = pending ? agsError : sightingError;
  const clearError = pending ? clearAgsError : clearSightingError;
  const loading = pending ? agsLoading : sightingLoading;
  const updateProperties = pending
    ? updateAgsProperties
    : updateSightingProperties;

  const [defaultFieldValues, setDefaultFieldValues] = useState({});

  const [customFieldValues, setCustomFieldValues] = useState({});

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

  function handleClose() {
    clearError();
    onClose();
  }

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      titleId="EDIT_SIGHTING_METADATA"
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
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            {error}
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={handleClose} id="CANCEL" />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            const properties = { ...defaultFieldValues };
            if (!isEmpty(customFieldValues))
              properties.customFields = customFieldValues;
            const response = await updateProperties({
              agsGuid: pending ? sightingId : undefined,
              sightingGuid: pending ? undefined : sightingId,
              properties,
            });
            if (response.status === 200) onClose();
          }}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
