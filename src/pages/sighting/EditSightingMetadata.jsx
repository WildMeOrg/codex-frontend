import React, { useEffect, useState } from 'react';
import { get, isEmpty, truncate } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import CustomAlert from '../../components/Alert';
import usePatchSighting from '../../models/sighting/usePatchSighting';
import usePatchAGS from '../../models/assetGroupSighting/usePatchAGS';
import InputRow from '../../components/fields/edit/InputRow';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';
import { useIntl } from 'react-intl';

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
  
  const intl = useIntl();

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

  const [ incompleteDateRangeError, setIncompleteDateRangeError ] = useState(false);

  useEffect(() => {
    // Only populate the form with the initial metadata values.
    if (open) {
      const defaultFieldMetadata = metadata.filter(
        field => !field.customField,
      );
      const customFieldMetadata = metadata.filter(
        field => field.customField,
      );

      setDefaultFieldValues(prev =>
        metadata.length > 0 && isEmpty(prev)
          ? getInitialFormValues(defaultFieldMetadata, 'name')
          : prev,
      );

      setCustomFieldValues(prev =>
        metadata.length > 0 && isEmpty(prev)
          ? getInitialFormValues(customFieldMetadata, 'id')
          : prev,
      );
    }
  }, [open, metadata]);

  function handleClose() {
    clearError();
    setIncompleteDateRangeError(false);
    setDefaultFieldValues({});
    setCustomFieldValues({});
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
                    setCustomFieldValues(prev => ({
                      ...prev,
                      [field.id]: newValue,
                    }));
                  } else {
                    setDefaultFieldValues(prev => ({
                      ...prev,
                      [field.name]: newValue,
                    }));
                  }
                }}
              />
            </InputRow>
          );
        })}

        {(incompleteDateRangeError ||error) && (
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            {incompleteDateRangeError ? intl.formatMessage({id : 'INCOMPLETE_DATE_RANGE_ERROR'}) : error}
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
            console.log('properties.customFields', properties.customFields);
            const regex = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
            // Check if the date range is complete
            for(const value of Object.values(properties['customFields'])) {
              console.log('value', value);
              console.log(1);
              if(Array.isArray(value)) {
                console.log(2);
                console.log('value[0]', value[0]);
                console.log(regex.test(value[0]));
                const noStartDate = !regex.test(JSON.stringify(value[0])) && regex.test(JSON.stringify(value[1]));
                const noEndDate = regex.test(JSON.stringify(value[0])) && !regex.test(JSON.stringify(value[1]));
                if(value.length === 2 && (noStartDate || noEndDate)) {
                  console.log(3);
                  setIncompleteDateRangeError(true);
                  return;
                } 
              }
            }
            const response = await updateProperties({
              agsGuid: pending ? sightingId : undefined,
              sightingGuid: pending ? undefined : sightingId,
              properties,
            });
            if (response?.status === 200) onClose();
          }}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
