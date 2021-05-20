import React, { useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import usePatchSighting from '../../models/sighting/usePatchSighting';
import InputRow from '../../components/fields/edit/InputRowNew';
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
  refreshSightingData,
}) {
  const {
    updateProperties,
    loading,
    error,
    setError,
  } = usePatchSighting();

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
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="SUBMISSION_ERROR" />
            </AlertTitle>
            {error}
          </Alert>
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
              sightingId,
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
