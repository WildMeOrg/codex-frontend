import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import useRemoveCustomField from '../../../models/site/useRemoveCustomField';
import usePutSiteSettings from '../../../models/site/usePutSiteSettings';
import ActionIcon from '../../../components/ActionIcon';
import Button from '../../../components/Button';
import ConfirmDelete from '../../../components/ConfirmDelete';
import Text from '../../../components/Text';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import { mergeItemById } from '../../../utils/manipulators';
import { fieldTypeInfo } from '../../../constants/fieldTypesNew';
import { createCustomFieldSchema } from '../../../utils/fieldUtils';

import FieldDemo from './FieldDemo';
import AddOrEditField from './AddOrEditField';

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
  const [editField, setEditField] = useState(null);
  const [previewField, setPreviewField] = useState(null);
  const [previewInitialValue, setPreviewInitialValue] = useState(
    null,
  );
  const { putSiteSetting, error, setError } = usePutSiteSettings();
  const { removeCustomField } = useRemoveCustomField();

  const putFields = definitions =>
    putSiteSetting(settingName, { definitions });

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
            <div style={{ display: 'flex' }}>
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
                onClick={() => setEditField(field)}
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
    if (error) setError(null);
    setDeleteField(null);
  };

  const onCloseEditField = () => {
    if (error) setError(null);
    setEditField(null);
  };

  return (
    <Grid item>
      <AddOrEditField
        newField={get(editField, 'name') === ''}
        open={Boolean(editField)}
        onClose={onCloseEditField}
        field={editField}
        error={error}
        categories={categories}
        onSubmit={editedField => {
          const newFields = mergeItemById(editedField, fields);

          putFields(newFields).then(requestSuccessful => {
            if (requestSuccessful) onCloseEditField();
          });
        }}
      />
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
        error={error}
        entityToDelete={get(deleteField, 'name')}
        onDelete={async () => {
          const deleteResult = await removeCustomField(
            settingName,
            deleteField.id,
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
        <Button
          id="ADD_NEW"
          size="small"
          display="panel"
          startIcon={<AddIcon />}
          onClick={() =>
            setEditField({
              schema: {
                displayType: '',
                label: '',
                description: '',
              },
              default: null,
              name: '',
              multiple: false,
              required: false,
              id: uuid(),
              timeCreated: Date.now(),
            })
          }
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
