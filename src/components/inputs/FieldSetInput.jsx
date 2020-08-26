import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  fieldTypeChoices,
  customFieldCategories,
} from '../../constants/fieldTypes';
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
  value,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  width = 330,
  required,
  ...rest
}) {
  const intl = useIntl();
  const fieldset = get(value, 'definitions', []);

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

        const displayType = fieldTypeChoices.find(
          f => get(field, ['schema', 'displayType']) === f.value,
        );

        const configuration = get(displayType, 'configuration', []);

        const displayName =
          get(field, ['schema', 'label']) || 'New custom field';

        return (
          <Accordion key={field.id} style={{ width }}>
            <AccordionSummary
              aria-controls={`${displayName} configuration`}
              id={field.id}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>{displayName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{ display: 'flex', flexDirection: 'column' }}
                {...rest}
              >
                <FormControl>
                  <TextInput
                    onChange={name => {
                      onChange({
                        definitions: [
                          ...otherFields,
                          {
                            ...field,
                            name,
                          },
                        ],
                      });
                    }}
                    schema={{
                      labelId: 'FIELD_VALUE',
                      descriptionId: 'FIELD_VALUE_DESCRIPTION',
                    }}
                    value={get(field, 'name', '')}
                  />
                </FormControl>
                <FormControl style={{ marginTop: 8 }}>
                  <TextInput
                    onChange={label => {
                      onChange({
                        definitions: [
                          ...otherFields,
                          updateSchema(field, 'label', label),
                        ],
                      });
                    }}
                    schema={{ labelId: 'FIELD_LABEL' }}
                    value={get(field, ['schema', 'label'], '')}
                  />
                </FormControl>
                <FormControl style={{ marginTop: 8 }}>
                  <TextInput
                    onChange={description => {
                      onChange({
                        definitions: [
                          ...otherFields,
                          updateSchema(
                            field,
                            'description',
                            description,
                          ),
                        ],
                      });
                    }}
                    schema={{
                      labelId: 'FIELD_DESCRIPTION',
                      displayType: 'longstring',
                    }}
                    value={get(field, ['schema', 'description'], '')}
                  />
                </FormControl>
                <FormControl style={{ width: 280, marginTop: 8 }}>
                  <InputLabel>
                    <FormattedMessage id="FIELD_TYPE" />
                  </InputLabel>
                  <Select
                    native
                    labelId="field-type-selector-label"
                    id="field-type-selector"
                    value={get(field, ['schema', 'displayType'], '')}
                    onChange={e => {
                      const newType = e.target.value;
                      const newFieldTypeSpecifier = fieldTypeChoices.find(
                        f => newType === f.value,
                      );

                      const newField = {
                        ...field,
                        multiple:
                          newFieldTypeSpecifier.backendMultiple,
                        type: newFieldTypeSpecifier.backendType,
                        schema: {
                          ...field.schema,
                          displayType: newType,
                        },
                      };

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

                      onChange({
                        definitions: [...otherFields, newField],
                      });
                    }}
                  >
                    {customFieldCategories.map(category => (
                      <optgroup
                        label={intl.formatMessage({
                          id: category.labelId,
                        })}
                        key={category.labelId}
                      >
                        {category.fields.map(categoryField => {
                          const option = fieldTypeChoices.find(
                            f => f.value === categoryField,
                          );
                          return (
                            <option
                              value={option.value}
                              key={option.value}
                            >
                              {intl.formatMessage({
                                id: option.labelId,
                              })}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 16 }}>
                  <BooleanInput
                    onChange={isRequired => {
                      onChange({
                        definitions: [
                          ...otherFields,
                          { ...field, required: isRequired },
                        ],
                      });
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
                        onChange({
                          definitions: [...otherFields, newField],
                        });
                      }}
                    />
                  );
                })}
                <Button
                  style={{ marginTop: 12 }}
                  disabled={!get(field, ['schema', 'displayType'])}
                  onClick={() => {
                    const fieldTypeSchema = fieldTypeChoices.find(
                      choice =>
                        get(field, ['schema', 'displayType']) ===
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
                  onClick={() =>
                    onChange({ definitions: otherFields })
                  }
                >
                  <FormattedMessage id="DELETE" />
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Button
        style={{ marginTop: 16 }}
        onClick={() => {
          onChange({
            definitions: [
              ...fieldset,
              {
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
              },
            ],
          });
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
