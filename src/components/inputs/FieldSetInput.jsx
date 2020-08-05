import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { fieldTypeChoices } from '../../constants/fieldTypes';
import BooleanInput from './BooleanInput';
import TextInput from './TextInput';
import OptionEditor from './fieldSetUtils/OptionEditor';
import FileTypeEditor from './fieldSetUtils/FileTypeEditor';
import Button from '../Button';
import FieldDemo from './fieldSetUtils/FieldDemo';

function updateSchema(field, property, value) {
  return {
    ...field,
    schema: { ...field.schema, [property]: value },
  };
}

function Core({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
}

export default function FieldSetInput({
  schema,
  value: fieldset,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  width = 330,
  required,
  ...rest
}) {
  fieldset.sort((a, b) => {
    if (a.timeCreated < b.timeCreated) return -1;
    return 1;
  });
  const [demoField, setDemoField] = useState(null);
  const [demoFieldInitialValue, setDemoFieldInitialValue] = useState(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = () => setModalOpen(false);

  return (
    <Core schema={schema} required={required} width={width}>
      <FieldDemo
        open={modalOpen}
        onClose={onClose}
        initialValue={demoFieldInitialValue}
        fieldProps={demoField}
      />
      {fieldset.map(field => {
        const otherFields = fieldset.filter(r => r.id !== field.id);

        const fieldType = fieldTypeChoices.find(
          f => get(field, ['schema', 'fieldType']) === f.value,
        );

        const configuration = get(fieldType, 'configuration', []);

        const displayName =
          get(field, ['schema', 'label']) || 'New custom field';

        return (
          <ExpansionPanel key={field.id} style={{ width }}>
            <ExpansionPanelSummary
              aria-controls={`${displayName} configuration`}
              id={field.id}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>{displayName}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div
                style={{ display: 'flex', flexDirection: 'column' }}
                {...rest}
              >
                <FormControl>
                  <TextInput
                    onChange={name => {
                      onChange([
                        ...otherFields,
                        updateSchema(field, 'name', name),
                      ]);
                    }}
                    schema={{
                      labelId: 'FIELD_VALUE',
                      descriptionId: 'FIELD_VALUE_DESCRIPTION',
                    }}
                    value={get(field, ['schema', 'name'], '')}
                  />
                </FormControl>
                <FormControl style={{ marginTop: 8 }}>
                  <TextInput
                    onChange={label => {
                      onChange([
                        ...otherFields,
                        updateSchema(field, 'label', label),
                      ]);
                    }}
                    schema={{ labelId: 'FIELD_LABEL' }}
                    value={get(field, ['schema', 'label'], '')}
                  />
                </FormControl>
                <FormControl style={{ marginTop: 8 }}>
                  <TextInput
                    onChange={description => {
                      onChange([
                        ...otherFields,
                        updateSchema(
                          field,
                          'description',
                          description,
                        ),
                      ]);
                    }}
                    schema={{
                      labelId: 'FIELD_DESCRIPTION',
                      fieldType: 'longstring',
                    }}
                    value={get(field, ['schema', 'description'], '')}
                  />
                </FormControl>
                <FormControl style={{ width: 280, marginTop: 8 }}>
                  <InputLabel>
                    <FormattedMessage id="FIELD_TYPE" />
                  </InputLabel>
                  <Select
                    labelId="field-type-selector-label"
                    id="field-type-selector"
                    value={get(field, ['schema', 'fieldType'], '')}
                    onChange={e => {
                      const newType = e.target.value;
                      const newField = updateSchema(
                        field,
                        'fieldType',
                        newType,
                      );
                      const newFieldTypeSpecifier = fieldTypeChoices.find(
                        f => newType === f.value,
                      );
                      const newConfiguration = get(
                        newFieldTypeSpecifier,
                        'configuration',
                        [],
                      );
                      newConfiguration.forEach(
                        configurableProperty => {
                          newField.schema[
                            configurableProperty.value
                          ] = configurableProperty.defaultValue;
                        },
                      );

                      onChange([...otherFields, newField]);
                    }}
                  >
                    {fieldTypeChoices.map(option => (
                      <MenuItem
                        value={option.value}
                        key={option.value}
                      >
                        <FormattedMessage id={option.labelId} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 16 }}>
                  <BooleanInput
                    onChange={isRequired => {
                      onChange([
                        ...otherFields,
                        { ...field, required: isRequired },
                      ]);
                    }}
                    schema={{ labelId: 'REQUIRED' }}
                    value={Boolean(field.required)}
                  />
                </FormControl>
                {configuration.map(configurableProperty => {
                  let ConfigurationInput = OptionEditor;
                  if (configurableProperty.type === 'boolean')
                    ConfigurationInput = BooleanInput;
                  if (configurableProperty.type === 'filetypeeditor')
                    ConfigurationInput = FileTypeEditor;

                  return (
                    <ConfigurationInput
                      key={configurableProperty.value}
                      value={get(field, [
                        'schema',
                        configurableProperty.value,
                      ])}
                      schema={{
                        labelId: configurableProperty.labelId,
                        descriptionId:
                          configurableProperty.descriptionId,
                      }}
                      onChange={newOptions => {
                        const newField = updateSchema(
                          field,
                          configurableProperty.value,
                          newOptions,
                        );
                        onChange([...otherFields, newField]);
                      }}
                    />
                  );
                })}
                <Button
                  style={{ marginTop: 12 }}
                  disabled={!get(field, ['schema', 'fieldType'])}
                  onClick={() => {
                    const fieldTypeSchema = fieldTypeChoices.find(
                      choice =>
                        get(field, ['schema', 'fieldType']) ===
                        choice.value,
                    );
                    setDemoField(field);
                    setModalOpen(true);
                    setDemoFieldInitialValue(
                      fieldTypeSchema.defaultValue,
                    );
                  }}
                >
                  <FormattedMessage id="TEST_FIELD" />
                </Button>
                <Button
                  style={{ marginTop: 4 }}
                  onClick={() => onChange(otherFields)}
                >
                  <FormattedMessage id="DELETE" />
                </Button>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
      <Button
        style={{ marginTop: 16 }}
        onClick={() => {
          onChange([
            ...fieldset,
            {
              schema: {
                fieldType: '',
                label: '',
                description: '',
                name: '',
              },
              required: false,
              id: uuid(),
              timeCreated: Date.now(),
            },
          ]);
        }}
        size="small"
      >
        <FormattedMessage
          id={fieldset.length > 0 ? 'ADD_ANOTHER_FIELD' : 'ADD_FIELD'}
        />
      </Button>
    </Core>
  );
}
