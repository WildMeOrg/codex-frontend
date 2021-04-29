import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import useRemoveCustomField from '../../../models/site/useRemoveCustomField';
import ActionIcon from '../../../components/ActionIcon';
import ButtonLink from '../../../components/ButtonLink';
import ConfirmDelete from '../../../components/ConfirmDelete';
import Text from '../../../components/Text';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import { fieldTypeInfo } from '../../../constants/fieldTypesNew';
import { createCustomFieldSchema } from '../../../utils/fieldUtils';

import FieldDemo from './FieldDemo';
import customFieldTypes from './constants/customFieldTypes';

export default function CustomFieldTable({
  categories,
  fields,
  descriptionId,
  titleId,
  settingName,
}) {
  const fieldSchemas = fields.map(houstonSchema => {
    const frontendSchema = createCustomFieldSchema(houstonSchema);

    const typeLabelId = get(fieldTypeInfo, [
      frontendSchema.fieldType,
      'labelId',
    ]);
    const category = categories.find(
      c => c.id === frontendSchema.categoryId,
    );
    return {
      ...frontendSchema,
      typeLabelId,
      categoryLabel: get(category, 'label', ''),
      houstonSchema,
    };
  });

  const intl = useIntl();
  const [deleteField, setDeleteField] = useState(null);
  const [previewField, setPreviewField] = useState(null);
  const [previewInitialValue, setPreviewInitialValue] = useState(
    null,
  );
  const {
    removeCustomField,
    needsForce,
    setNeedsForce,
    error: removeCustomFieldError,
    setError: setRemoveCustomFieldError,
  } = useRemoveCustomField();

  const fieldTypeDefinition = Object.values(customFieldTypes).find(
    type => type.backendPath === settingName,
  );
  const fieldTypeName = fieldTypeDefinition.name;

  const tableColumns = useMemo(
    () => [
      {
        name: 'label',
        label: intl.formatMessage({ id: 'LABEL' }),
      },
      {
        name: 'name',
        label: intl.formatMessage({ id: 'VALUE' }),
      },
      {
        name: 'typeLabelId',
        label: intl.formatMessage({ id: 'FIELD_TYPE' }),
        options: {
          customBodyRender: labelId => (
            <Text variant="body2" id={labelId} />
          ),
        },
      },
      {
        name: 'categoryLabel',
        label: intl.formatMessage({ id: 'CATEGORY' }),
      },
      {
        name: 'actions',
        label: intl.formatMessage({ id: 'ACTIONS' }),
        options: {
          customBodyRender: (_, field) => (
            <div>
              <ActionIcon
                variant="view"
                labelId="PREVIEW"
                onClick={() => {
                  setPreviewInitialValue(field.defaultValue);
                  setPreviewField(field);
                }}
              />
              <ActionIcon
                variant="edit"
                href={`/admin/settings/save-custom-field/${fieldTypeName}/${
                  field.id
                }`}
              />
              <ActionIcon
                variant="delete"
                onClick={() => setDeleteField(field)}
              />
            </div>
          ),
        },
      },
    ],
    [],
  );

  const onCloseConfirmDelete = () => {
    if (removeCustomFieldError) setRemoveCustomFieldError(null);
    if (needsForce) setNeedsForce(false);
    setDeleteField(null);
  };

  return (
    <Grid item>
      <FieldDemo
        open={Boolean(previewField)}
        onClose={() => setPreviewField(null)}
        initialValue={previewInitialValue}
        fieldProps={previewField}
      />
      <ConfirmDelete
        open={Boolean(deleteField)}
        onClose={onCloseConfirmDelete}
        titleId="DELETE_FIELD"
        messageId="CONFIRM_DELETE_CUSTOM_FIELD_DESCRIPTION"
        error={removeCustomFieldError}
        entityToDelete={get(deleteField, 'name')}
        onDelete={async () => {
          const deleteResult = await removeCustomField(
            settingName,
            deleteField.id,
            needsForce,
          );
          if (deleteResult) onCloseConfirmDelete();
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <Text variant="h5" component="h5" id={titleId} />
        <ButtonLink
          id="ADD_NEW"
          size="small"
          display="panel"
          startIcon={<AddIcon />}
          href={`/admin/settings/save-custom-field/${fieldTypeName}`}
        />
      </div>
      <Text
        variant="caption"
        style={{ marginBottom: 12 }}
        id={descriptionId}
      />
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={fieldSchemas}
      />
    </Grid>
  );
}
