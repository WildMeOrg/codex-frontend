import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

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

export default function CustomFieldTable({
  categories,
  fields,
  titleId,
  settingName,
}) {
  const intl = useIntl();
  const [deleteField, setDeleteField] = useState(null);
  const { putSiteSetting, error, setError } = usePutSiteSettings();

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
        customBodyRender: (_, field) => {
          return (
            <div>
              <Tooltip title={intl.formatMessage({ id: 'PREVIEW' })}>
                <IconButton
                  onClick={() => {}}
                  aria-label={intl.formatMessage({ id: 'PREVIEW' })}
                >
                  <PreviewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'EDIT' })}>
                <IconButton
                  onClick={() => {}}
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
          );
        },
      },
    },
  ];

  const onCloseConfirmDelete = () => {
    if (error) setError(null);
    setDeleteField(null);
  };

  return (
    <Grid item>
      <ConfirmDelete
        open={Boolean(deleteField)}
        onClose={onCloseConfirmDelete}
        title={<FormattedMessage id="DELETE_FIELD" />}
        message={
          <FormattedMessage
            id="CONFIRM_DELETE_FIELD"
            values={{ field: get(deleteField, 'name') }}
          />
        }
        onDelete={() => {
          const newCustomCategories = removeItemById(
            deleteField,
            fields,
          );
          console.log(fields, newCustomCategories);
          putSiteSetting(
            settingName,
            newCustomCategories,
          ).then(() => {
            onCloseConfirmDelete();
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
          onClick={() => {}}
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
