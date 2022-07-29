import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import CustomAlert from '../../../components/Alert';

import useSiteSettings from '../../../models/site/useSiteSettings';
import usePutSiteSetting from '../../../models/site/usePutSiteSetting';
import Button from '../../../components/Button';
import ActionIcon from '../../../components/ActionIcon';
import ConfirmDelete from '../../../components/ConfirmDelete';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import Text from '../../../components/Text';
import StandardDialog from '../../../components/StandardDialog';
import InputRow from '../../../components/fields/edit/InputRow';
import TextEditor from '../../../components/fields/edit/TextEditor';
import SelectionEditor from '../../../components/fields/edit/SelectionEditor';
import categoryTypes from '../../../constants/categoryTypes';
import {
  defaultIndividualCategories,
  defaultSightingCategories,
} from '../../../constants/fieldCategories';
import {
  mergeItemById,
  removeItemById,
} from '../../../utils/manipulators';
import { cellRendererTypes } from '../../../components/dataDisplays/cellRenderers';

const defaultCategories = [
  ...Object.values(defaultSightingCategories).map(c => ({
    ...c,
    key: c.name,
    type: categoryTypes.sighting,
    isDefault: true,
  })),
  ...Object.values(defaultIndividualCategories).map(c => ({
    ...c,
    key: c.name,
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
  const {
    mutate: putSiteSetting,
    error,
    setError,
  } = usePutSiteSetting();

  const customFieldCategories = get(
    siteSettings,
    [categorySettingName, 'value'],
    [],
  );

  const customFieldCategoriesWithKey = customFieldCategories.map(
    c => ({
      ...c,
      key: c?.id,
    }),
  );

  const categories = [
    ...defaultCategories,
    ...customFieldCategoriesWithKey,
  ];

  const categoryColumns = [
    {
      name: 'labelId',
      labelId: 'LABEL',
      options: {
        customBodyRender: (labelId, category) => {
          if (labelId) return <Text variant="body2" id={labelId} />;
          return (
            <Text variant="body2">
              {get(category, 'label', 'Unlabeled category')}
            </Text>
          );
        },
      },
    },
    {
      name: 'type',
      labelId: 'TYPE',
      options: { cellRenderer: cellRendererTypes.capitalizedString },
    },
    {
      name: 'actions',
      labelId: 'ACTIONS',
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
        onDelete={async () => {
          const newCustomCategories = removeItemById(
            deleteCategory,
            customFieldCategories,
          );
          const response = await putSiteSetting({
            property: categorySettingName,
            data: newCustomCategories,
          });
          if (response?.status === 200) onCloseConfirmDelete();
        }}
      />
      {dialogData && (
        <StandardDialog
          titleId={
            dialogData.isDefault ? 'VIEW_CATEGORY' : 'EDIT_CATEGORY'
          }
          size="md"
          open
          onClose={onCloseCategoryDialog}
        >
          <DialogContent>
            <Text
              variant="caption"
              id={
                dialogData.isDefault
                  ? 'DEFAULT_CATEGORY_NOT_EDITABLE'
                  : 'CATEGORY_EDIT_MESSAGE'
              }
            />
            <InputRow schema={{ labelId: 'LABEL' }}>
              <TextEditor
                disabled={dialogData.isDefault}
                schema={{ labelId: 'LABEL' }}
                value={dialogData.label || ''}
                onChange={newLabel =>
                  setDialogData({ ...dialogData, label: newLabel })
                }
              />
            </InputRow>
            <InputRow schema={{ labelId: 'TYPE' }}>
              <SelectionEditor
                disabled={dialogData.isDefault}
                schema={{
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
            </InputRow>
            {error && (
              <CustomAlert severity="error">{error}</CustomAlert>
            )}
          </DialogContent>
          <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
            {dialogData.isDefault ? (
              <Button
                display="basic"
                onClick={onCloseCategoryDialog}
                id="CLOSE"
              />
            ) : (
              <>
                <Button
                  display="basic"
                  onClick={onCloseCategoryDialog}
                  id="CANCEL"
                />
                <Button
                  display="primary"
                  id="SAVE"
                  onClick={async () => {
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
                      const response = await putSiteSetting({
                        property: categorySettingName,
                        data: newCustomCategories,
                      });
                      if (response?.status === 200)
                        onCloseCategoryDialog();
                    }
                  }}
                />
              </>
            )}
          </DialogActions>
        </StandardDialog>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <Text variant="h5" component="h5" id="FIELD_CATEGORIES" />
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
          id="ADD_NEW"
        />
      </div>
      <Text
        component="p"
        variant="caption"
        style={{ marginBottom: 12 }}
        id="FIELD_CATEGORIES_DESCRIPTION"
      />
      <DataDisplay
        noTitleBar
        idKey="key"
        variant="secondary"
        columns={categoryColumns}
        data={categories}
        tableContainerStyles={{ maxHeight: 300 }}
      />
    </Grid>
  );
}
