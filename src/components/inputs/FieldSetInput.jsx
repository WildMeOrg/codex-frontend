import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { fieldTypeChoices } from '../../constants/fieldTypes';
import BooleanInput from './BooleanInput';
import TextInput from './TextInput';
import OptionEditor from './OptionEditor';
import DeleteButton from '../DeleteButton';

export default function FieldSetInput({
  schema,
  value: fieldset,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  fieldset.sort((a, b) => {
    if (a.timeCreated < b.timeCreated) return -1;
    return 1;
  });

  return (
    <div>
      {fieldset.map(field => {
        const otherFields = fieldset.filter(r => r.id !== field.id);

        const fieldType = fieldTypeChoices.find(
          f => field.type === f.value,
        );

        const configuration = get(fieldType, 'configuration', []);

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 12,
            }}
            key={field.id}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                <FormattedMessage id="CUSTOM_FIELD" />
              </Typography>
              <DeleteButton onClick={() => onChange(otherFields)} />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column' }}
              {...rest}
            >
              <FormControl>
                <TextInput
                  onChange={value => {
                    onChange([...otherFields, { ...field, value }]);
                  }}
                  schema={{ labelId: 'FIELD_VALUE' }}
                  value={field.value}
                />
              </FormControl>
              <FormControl>
                <TextInput
                  onChange={label => {
                    onChange([...otherFields, { ...field, label }]);
                  }}
                  schema={{ labelId: 'FIELD_LABEL' }}
                  value={field.label}
                />
              </FormControl>
              <FormControl>
                <TextInput
                  onChange={description => {
                    onChange([
                      ...otherFields,
                      { ...field, description },
                    ]);
                  }}
                  schema={{
                    labelId: 'FIELD_DESCRIPTION',
                    fieldType: 'longstring',
                  }}
                  value={field.description}
                />
              </FormControl>
              <FormControl style={{ width: 280 }}>
                <InputLabel>
                  <FormattedMessage id="FIELD_TYPE" />
                </InputLabel>
                <Select
                  labelId="field-type-selector-label"
                  id="field-type-selector"
                  value={field.type}
                  onChange={e => {
                    const newType = e.target.value;
                    const newField = { ...field, type: newType };
                    const newFieldTypeSpecifier = fieldTypeChoices.find(
                      f => newType === f.value,
                    );
                    const newConfiguration = get(
                      newFieldTypeSpecifier,
                      'configuration',
                      [],
                    );
                    newConfiguration.forEach(configurableProperty => {
                      newField[configurableProperty.value] =
                        configurableProperty.defaultValue;
                    });

                    onChange([...otherFields, newField]);
                  }}
                >
                  {fieldTypeChoices.map(option => (
                    <MenuItem value={option.value} key={option.value}>
                      <FormattedMessage id={option.labelId} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl style={{ marginTop: 16 }}>
                <BooleanInput
                  onChange={required => {
                    onChange([
                      ...otherFields,
                      { ...field, required },
                    ]);
                  }}
                  schema={{ labelId: 'REQUIRED' }}
                  value={Boolean(field.required)}
                />
              </FormControl>
              {configuration.map(configurableProperty => {
                return (
                  <OptionEditor
                    key={configurableProperty.value}
                    value={field[configurableProperty.value]}
                    schema={{
                      labelId: configurableProperty.labelId,
                      descriptionId:
                        configurableProperty.descriptionId,
                    }}
                    onChange={newOptions => {
                      const newField = {
                        ...field,
                        [configurableProperty.value]: newOptions,
                      };
                      onChange([...otherFields, newField]);
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <Button
        style={{ marginTop: 16 }}
        onClick={() => {
          onChange([
            ...fieldset,
            {
              type: '',
              label: '',
              description: '',
              value: '',
              id: uuid(),
              timeCreated: Date.now(),
            },
          ]);
        }}
        size="small"
        variant="outlined"
      >
        <FormattedMessage
          id={fieldset.length > 0 ? 'ADD_ANOTHER_FIELD' : 'ADD_FIELD'}
        />
      </Button>
    </div>
  );
}
