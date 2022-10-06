import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import CustomAlert from '../../../../components/Alert';

import usePutSiteSetting from '../../../../models/site/usePutSiteSetting';
import { createCustomFieldSchema } from '../../../../utils/fieldUtils';
import { fieldTypeInfo } from '../../../../constants/fieldTypesNew';
import useSiteSettings from '../../../../models/site/useSiteSettings';
import MainColumn from '../../../../components/MainColumn';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import MetadataCard from '../../../../components/cards/MetadataCard';
import InputRow from '../../../../components/fields/edit/InputRow';
import { mergeItemById } from '../../../../utils/manipulators';
import customFieldTypes from '../constants/customFieldTypes';
import getTypeCategories from './getTypeCategories';
import OptionEditorButton from './OptionEditorButton';

const inputWidth = 280;

export default function SaveField() {
  const [formData, setFormData] = useState(null);
  const [lookupFieldError, setLookupFieldError] = useState(false);
  const { id, type } = useParams();
  const history = useHistory();
  const {
    data,
    loading,
    error: fetchSiteSettingsError,
  } = useSiteSettings();

  const {
    mutate: putSiteSetting,
    error: putSiteSettingError,
    setError: setPutSiteSettingError,
  } = usePutSiteSetting();

  const newField = !id;

  const loadingError = lookupFieldError || fetchSiteSettingsError;
  const disableForm =
    loading || lookupFieldError || fetchSiteSettingsError;

  useEffect(() => {
    if (!data) return undefined;
    if (newField) {
      setFormData({
        id: uuid(),
        timeCreated: Date.now(),
        required: false,
        name: 'field_name',
        type: fieldTypeInfo.string.backendType,
        default: fieldTypeInfo.string.initialDefaultValue,
        multiple: fieldTypeInfo.string.backendMultiple,
        schema: {
          displayType: fieldTypeInfo.string.value,
          label: 'Field label',
          description: 'Field description',
          category: null,
        },
      });
    } else {
      const backendFieldType = get(customFieldTypes, [
        type,
        'backendPath',
      ]);
      const fieldsInType = get(
        data,
        [backendFieldType, 'value', 'definitions'],
        [],
      );
      const matchingField = fieldsInType.find(
        field => field.id === id,
      );

      if (matchingField) {
        setFormData(matchingField);
      } else {
        setLookupFieldError(true);
      }
    }
    return undefined;
  }, [id, newField, type, data]);

  const fieldSchema = formData
    ? createCustomFieldSchema(formData)
    : null;
  const fieldType = get(formData, ['schema', 'displayType']);
  const defaultEditable = get(
    fieldTypeInfo,
    [fieldType, 'canProvideDefaultValue'],
    false,
  );

  const showOptionButton = Boolean(
    get(formData, ['schema', 'choices']),
  );

  const categoryOptions = getTypeCategories(data, type);
  const selectedCategory = get(formData, ['schema', 'category'], '');

  return (
    <MainColumn
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 1120,
        margin: '64px 0 0 0', // Do not switch to margin top, needs to override default margin
      }}
    >
      <Paper elevation={16} style={{ minHeight: '100vh' }}>
        <Text
          variant="h5"
          style={{ margin: '16px 0 0 16px' }}
          id="CONFIGURATION"
        />
        <Divider style={{ margin: '12px 0 24px 0' }} />
        <Grid
          container
          direction="column"
          spacing={2}
          style={{ padding: '0 16px', marginBottom: 48 }}
        >
          <Grid item>
            <FormControl
              required
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <TextField
                id="name"
                disabled={disableForm}
                onChange={e =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                label={<FormattedMessage id="FIELD_VALUE" />}
                value={get(formData, 'name', '')}
              />
              <FormHelperText>
                <FormattedMessage id="FIELD_VALUE_DESCRIPTION" />
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <InputLabel>
                <FormattedMessage id="TYPE" />
              </InputLabel>
              <Select
                id="name"
                disabled={disableForm || !newField}
                onChange={e => {
                  const nextFieldType = e.target.value;
                  const nextBackendFieldType =
                    fieldTypeInfo[nextFieldType].backendType;
                  const nextMultiple =
                    fieldTypeInfo[nextFieldType].backendMultiple;

                  const nextFormData = {
                    ...formData,
                    multiple: nextMultiple,
                    type: nextBackendFieldType,
                    schema: {
                      ...formData.schema,
                      displayType: nextFieldType,
                    },
                  };

                  if (
                    fieldTypeInfo[nextFieldType]
                      .canProvideDefaultValue
                  ) {
                    const nextInitialDefault =
                      fieldTypeInfo[nextFieldType]
                        .initialDefaultValue;
                    nextFormData.default = nextInitialDefault;
                  }

                  const fieldTypesWithChoices = [
                    fieldTypeInfo.select.value,
                    fieldTypeInfo.multiselect.value,
                  ];
                  if (fieldTypesWithChoices.includes(nextFieldType)) {
                    nextFormData.schema.choices = [];
                  } else {
                    delete nextFormData.schema.choices;
                  }

                  setFormData(nextFormData);
                }}
                value={get(formData, ['schema', 'displayType'], '')}
              >
                {Object.values(fieldTypeInfo).map(typeInfo => (
                  <MenuItem
                    key={typeInfo.value}
                    value={typeInfo.value}
                  >
                    <FormattedMessage id={typeInfo.labelId} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                <FormattedMessage id="CANNOT_EDIT_CUSTOM_FIELD_TYPE" />
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl style={{ width: 220, marginBottom: 4 }}>
              <FormControlLabel
                control={
                  <Switch disabled={disableForm} name="required" />
                }
                label={<FormattedMessage id="REQUIRED" />}
                checked={get(formData, 'required', false)}
                onChange={e =>
                  setFormData({
                    ...formData,
                    required: e.target.checked,
                  })
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              required
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <TextField
                id="label"
                disabled={disableForm}
                label={<FormattedMessage id="LABEL" />}
                value={get(formData, ['schema', 'label'], '')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    schema: {
                      ...formData.schema,
                      label: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <TextField
                id="description"
                multiline
                disabled={disableForm}
                label={<FormattedMessage id="DESCRIPTION" />}
                value={get(formData, ['schema', 'description'], '')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    schema: {
                      ...formData.schema,
                      description: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl
              style={{ width: inputWidth, marginBottom: 4 }}
            >
              <InputLabel required>
                <FormattedMessage id="CATEGORY" />
              </InputLabel>
              <Select
                id="category"
                required
                disabled={disableForm}
                onChange={e =>
                  setFormData({
                    ...formData,
                    schema: {
                      ...formData.schema,
                      category: e.target.value,
                    },
                  })
                }
                value={selectedCategory}
              >
                {Object.values(categoryOptions).map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {showOptionButton ? (
            <OptionEditorButton
              value={get(formData, ['schema', 'choices'], [])}
              onChange={nextChoices =>
                setFormData({
                  ...formData,
                  schema: {
                    ...formData.schema,
                    choices: nextChoices,
                  },
                })
              }
            />
          ) : null}
          {defaultEditable ? (
            <Grid item>
              <fieldSchema.editComponent
                {...get(fieldSchema, 'editComponentProps', {})}
                schema={{
                  ...fieldSchema,
                  labelId: 'DEFAULT_VALUE',
                  name: 'custom-field-default-value',
                  descriptionId: 'FIELD_DEFAULT_VALUE_DESCRIPTION',
                }}
                value={get(formData, ['schema', 'defaultValue'])}
                onChange={nextDefaultValue => {
                  setFormData({
                    ...formData,
                    default: nextDefaultValue,
                  });
                }}
                disabled={disableForm}
                choices={get(
                  formData,
                  ['schema', 'choices'],
                  undefined,
                )}
              />
            </Grid>
          ) : null}
        </Grid>
      </Paper>
      <Grid container direction="column" style={{ padding: 32 }}>
        <Grid item>
          <Text
            variant="h3"
            id={newField ? 'NEW_CUSTOM_FIELD' : 'EDIT_CUSTOM_FIELD'}
          />
        </Grid>
        {loadingError ? (
          <Grid item>
            <CustomAlert
              severity="error"
              style={{ marginTop: 20 }}
              titleId="AN_ERROR_OCCURRED"
              descriptionId={
                fetchSiteSettingsError
                  ? 'FETCH_SITE_SETTINGS_ERROR'
                  : 'CUSTOM_FIELD_NOT_FOUND_ERROR'
              }
            />
          </Grid>
        ) : (
          <>
            <Grid item style={{ margin: '32px 0' }}>
              <Text
                variant="body2"
                id="CUSTOM_FIELD_REPORT_PREVIEW"
              />
              <Paper
                elevation={2}
                style={{
                  marginTop: 12,
                  padding: '8px 12px 16px 12px',
                }}
              >
                {fieldSchema && (
                  <InputRow schema={fieldSchema}>
                    <fieldSchema.editComponent
                      {...get(fieldSchema, 'editComponentProps', {})}
                      schema={fieldSchema}
                      value={get(formData, [
                        'schema',
                        'defaultValue',
                      ])}
                      onChange={Function.prototype}
                      minimalLabels
                    />
                  </InputRow>
                )}
              </Paper>
            </Grid>
            <Grid item style={{ marginBottom: 32 }}>
              <Text
                style={{ marginBottom: 12 }}
                variant="body2"
                id="CUSTOM_FIELD_METADATA_PREVIEW"
              />
              {fieldSchema ? (
                <MetadataCard
                  metadata={[
                    {
                      ...fieldSchema,
                      value: get(fieldTypeInfo, [
                        fieldType,
                        'exampleValue',
                      ]),
                    },
                  ]}
                  showDefaultValues
                />
              ) : null}
            </Grid>
            {putSiteSettingError ? (
              <Grid item>
                <CustomAlert
                  severity="error"
                  style={{ marginBottom: 20 }}
                  titleId="SUBMISSION_ERROR"
                  description={putSiteSettingError}
                />
              </Grid>
            ) : null}
            <Grid item>
              <Button
                id="SAVE_FIELD"
                display="primary"
                disabled={!selectedCategory}
                onClick={async () => {
                  if (putSiteSettingError)
                    setPutSiteSettingError(null);

                  const backendFieldType = get(customFieldTypes, [
                    type,
                    'backendPath',
                  ]);
                  const fieldsInType = get(
                    data,
                    [backendFieldType, 'value', 'definitions'],
                    [],
                  );

                  const newFields = mergeItemById(
                    formData,
                    fieldsInType,
                  );

                  const response = await putSiteSetting({
                    property: backendFieldType,
                    data: { definitions: newFields },
                  });
                  if (response?.status === 200)
                    history.push('/settings/fields');
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </MainColumn>
  );
}
