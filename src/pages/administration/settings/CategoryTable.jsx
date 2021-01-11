import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';

import useSiteSettings from '../../../models/site/useSiteSettings';
import usePutSiteSettings from '../../../models/site/usePutSiteSettings';
import Button from '../../../components/Button';
import ActionIcon from '../../../components/ActionIcon';
import InputRow from '../../../components/InputRow';
import ConfirmDelete from '../../../components/ConfirmDelete';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import categoryTypes from '../../../constants/categoryTypes';
import { defaultSightingCategories } from '../../../constants/newSightingSchema';
import { defaultIndividualCategories } from '../../../constants/individualSchema';
import {
  mergeItemById,
  removeItemById,
} from '../../../utils/manipulators';

const defaultCategories = [
  ...defaultSightingCategories.map(c => ({
    ...c,
    type: categoryTypes.sighting,
    isDefault: true,
  })),
  ...defaultIndividualCategories.map(c => ({
    ...c,
    type: categoryTypes.individual,
    isDefault: true,
  })),
];

const categorySettingName = 'site.custom.customFieldCategories';

export default function FieldSettings() {
  const intl = useIntl();
  const [dialogData, setDialogData] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const { data: siteSettings, loading } = useSiteSettings();
  const { putSiteSetting, error, setError } = usePutSiteSettings();

  const customFieldCategories = get(
    siteSettings,
    [categorySettingName, 'value'],
    [],
  );

  const categories = [...defaultCategories, ...customFieldCategories];

  const categoryColumns = [
    {
      name: 'label',
      label: intl.formatMessage({ id: 'LABEL' }),
    },
    {
      name: 'type',
      label: intl.formatMessage({ id: 'TYPE' }),
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, category) => {
          const { isDefault } = category;
          if (isDefault)
            return (
              <ActionIcon
                labelId="VIEW_ONLY"
                variant="view"
                onClick={() => setDialogData(category)}
              />
            );
          return (
            <div>
              <ActionIcon
                variant="edit"
                onClick={() => setDialogData(category)}
              />
              <ActionIcon
                labelId="REMOVE"
                variant="delete"
                onClick={() => setDeleteCategory(category)}
              />
            </div>
          );
        },
      },
    },
  ];

  const onCloseCategoryDialog = () => {
    if (error) setError(null);
    setDialogData(null);
  };
  const onCloseConfirmDelete = () => {
    if (error) setError(null);
    setDeleteCategory(null);
  };

  if (loading) return null;

  return (
    <Grid item>
      <ConfirmDelete
        open={Boolean(deleteCategory)}
        onClose={onCloseConfirmDelete}
        title={<FormattedMessage id="REMOVE_CATEGORY" />}
        message={
          <FormattedMessage
            id="CONFIRM_DELETE_CATEGORY"
            values={{ category: get(deleteCategory, 'label') }}
          />
        }
        onDelete={() => {
          const newCustomCategories = removeItemById(
            deleteCategory,
            customFieldCategories,
          );
          putSiteSetting(
            categorySettingName,
            newCustomCategories,
          ).then(() => {
            onCloseConfirmDelete();
          });
        }}
      />
      {dialogData && (
        <Dialog size="md" open onClose={onCloseCategoryDialog}>
          <DialogTitle>
            {dialogData.isDefault ? (
              <FormattedMessage id="VIEW_CATEGORY" />
            ) : (
              <FormattedMessage id="EDIT_CATEGORY" />
            )}
          </DialogTitle>
          <DialogContent>
            <Typography variant="caption">
              <FormattedMessage
                id={
                  dialogData.isDefault
                    ? 'DEFAULT_CATEGORY_NOT_EDITABLE'
                    : 'CATEGORY_EDIT_MESSAGE'
                }
              />
            </Typography>
            <InputRow
              labelId="LABEL"
              disabled={dialogData.isDefault}
              schema={{
                fieldType: 'string',
                labelId: 'LABEL',
              }}
              value={dialogData.label || ''}
              onChange={newLabel =>
                setDialogData({ ...dialogData, label: newLabel })
              }
            />
            <InputRow
              labelId="TYPE"
              disabled={dialogData.isDefault}
              schema={{
                fieldType: 'select',
                labelId: 'TYPE',
                choices: Object.values(categoryTypes).map(ct => ({
                  label: ct,
                  value: ct,
                })),
              }}
              value={dialogData.type || ''}
              onChange={newType =>
                setDialogData({ ...dialogData, type: newType })
              }
            />
            {error && <Alert severity="error">{error}</Alert>}
          </DialogContent>
          <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
            {dialogData.isDefault ? (
              <Button display="basic" onClick={onCloseCategoryDialog}>
                <FormattedMessage id="CLOSE" />
              </Button>
            ) : (
              <>
                <Button
                  display="basic"
                  onClick={onCloseCategoryDialog}
                >
                  <FormattedMessage id="CANCEL" />
                </Button>
                <Button
                  display="primary"
                  onClick={() => {
                    if (!(dialogData.label && dialogData.type)) {
                      setError(
                        intl.formatMessage({
                          id: 'CATEGORY_FORM_REQUIRED_ERROR',
                        }),
                      );
                    } else {
                      const newCustomCategories = mergeItemById(
                        dialogData,
                        customFieldCategories,
                      );
                      putSiteSetting(
                        categorySettingName,
                        newCustomCategories,
                      ).then(() => {
                        onCloseCategoryDialog();
                      });
                    }
                  }}
                >
                  <FormattedMessage id="SAVE" />
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '12px 0',
        }}
      >
        <Typography variant="h5" component="h5">
          <FormattedMessage id="FIELD_CATEGORIES" />
        </Typography>
        <Button
          size="small"
          display="panel"
          startIcon={<AddIcon />}
          onClick={() =>
            setDialogData({
              id: uuid(),
              label: '',
              type: null,
              timeCreated: Date.now(),
            })
          }
        >
          <FormattedMessage id="ADD_NEW" />
        </Button>
      </div>
      <Typography variant="caption" style={{ marginBottom: 12 }}>
        <FormattedMessage id="FIELD_CATEGORIES_DESCRIPTION" />
      </Typography>
      <DataDisplay
        noTitleBar
        variant="secondary"
        columns={categoryColumns}
        data={categories}
      />
    </Grid>
  );
}
