import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import usePutSiteSettings from '../../../models/site/usePutSiteSettings';
import ActionIcon from '../../../components/ActionIcon';
import Button from '../../../components/Button';
import ConfirmDelete from '../../../components/ConfirmDelete';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import {
  mergeItemById,
  removeItemById,
} from '../../../utils/manipulators';
import { fieldTypeChoices } from '../../../constants/fieldTypes';

import FieldDemo from './FieldDemo';
import AddOrEditField from './AddOrEditField';

export default function CustomFieldTable({
  categories,
  fields,
  descriptionId,
  titleId,
  settingName,
}) {
  const intl = useIntl();
  const [deleteField, setDeleteField] = useState(null);
  const [editField, setEditField] = useState(null);
  const [previewField, setPreviewField] = useState(null);
  const [previewInitialValue, setPreviewInitialValue] = useState(
    null,
  );
  const { putSiteSetting, error, setError } = usePutSiteSettings();

  const putFields = definitions =>
    putSiteSetting(settingName, { definitions });

  const tableColumns = [
    {
      name: 'schema.label',
      label: intl.formatMessage({ id: 'LABEL' }),
    },
    {
      name: 'name',
      label: intl.formatMessage({ id: 'VALUE' }),
    },
    {
      name: 'schema.displayType',
      label: intl.formatMessage({ id: 'FIELD_TYPE' }),
    },
    {
      name: 'schema.category',
      label: intl.formatMessage({ id: 'CATEGORY' }),
      options: {
        customBodyRender: categoryId => {
          const category = categories.find(c => c.id === categoryId);
          return get(category, 'label', '');
        },
      },
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
                const fieldDisplayType = get(field, [
                  'schema',
                  'displayType',
                ]);

                const displayTypeSchema = fieldTypeChoices.find(
                  schema => fieldDisplayType === schema.value,
                );

                setPreviewInitialValue(
                  get(displayTypeSchema, 'defaultValue'),
                );
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
  ];

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
        title={<FormattedMessage id="DELETE_FIELD" />}
        error={error}
        message={
          <FormattedMessage
            id="CONFIRM_DELETE_FIELD"
            values={{ field: get(deleteField, 'name') }}
          />
        }
        onDelete={() => {
          const newFields = removeItemById(deleteField, fields);
          putFields(newFields).then(requestSuccessful => {
            if (requestSuccessful) onCloseConfirmDelete();
          });
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
        <Typography variant="h5" component="h5">
          <FormattedMessage id={titleId} />
        </Typography>
        <Button
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
              name: '',
              multiple: false,
              required: false,
              id: uuid(),
              timeCreated: Date.now(),
            })
          }
        >
          <FormattedMessage id="ADD_NEW" />
        </Button>
      </div>
      <Typography variant="caption" style={{ marginBottom: 12 }}>
        <FormattedMessage id={descriptionId} />
      </Typography>
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={fields}
      />
    </Grid>
  );
}
