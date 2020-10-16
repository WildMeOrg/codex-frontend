import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import PreviewIcon from '@material-ui/icons/Visibility';

import usePutSiteSettings from '../../../models/site/usePutSiteSettings';
import Button from '../../../components/Button';
import ConfirmDelete from '../../../components/ConfirmDelete';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import {
  mergeItemById,
  removeItemById,
} from '../../../utils/manipulators';
import { fieldTypeChoices } from '../../../constants/fieldTypes';

import FieldDemo from './FieldDemo';
import EditField from './EditField';

export default function CustomFieldTable({
  categories,
  fields,
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
      label: intl.formatMessage({ id: 'TYPE' }),
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, field) => (
          <div>
            <Tooltip title={intl.formatMessage({ id: 'PREVIEW' })}>
              <IconButton
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
                aria-label={intl.formatMessage({ id: 'PREVIEW' })}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'EDIT' })}>
              <IconButton
                onClick={() => setEditField(field)}
                aria-label={intl.formatMessage({ id: 'EDIT' })}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'DELETE' })}>
              <IconButton
                onClick={() => setDeleteField(field)}
                aria-label={intl.formatMessage({ id: 'DELETE' })}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
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
      <EditField
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
          margin: '12px 0',
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
      <DataDisplay
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={fields}
      />
    </Grid>
  );
}
