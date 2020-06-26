import React from 'react';
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
import OptionEditor from './OptionEditor';
import Button from '../Button';

export default function FieldSetInput({
  schema,
  value: fieldset,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  width = 330,
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

        const displayName =
          field.label === '' ? 'New custom field' : field.label;

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
                    onChange={value => {
                      onChange([...otherFields, { ...field, value }]);
                    }}
                    schema={{
                      labelId: 'FIELD_VALUE',
                      descriptionId: 'FIELD_VALUE_DESCRIPTION',
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormControl style={{ marginTop: 8 }}>
                  <TextInput
                    onChange={label => {
                      onChange([...otherFields, { ...field, label }]);
                    }}
                    schema={{ labelId: 'FIELD_LABEL' }}
                    value={field.label}
                  />
                </FormControl>
                <FormControl style={{ marginTop: 8 }}>
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
                <FormControl style={{ width: 280, marginTop: 8 }}>
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
                      newConfiguration.forEach(
                        configurableProperty => {
                          newField[configurableProperty.value] =
                            configurableProperty.defaultValue;
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
                {configuration.map(configurableProperty => (
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
                ))}
                <Button
                  style={{ width: 220, marginTop: 16 }}
                  variant="outlined"
                  size="small"
                  onClick={() => onChange(otherFields)}
                >
                  Delete this field
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
      >
        <FormattedMessage
          id={fieldset.length > 0 ? 'ADD_ANOTHER_FIELD' : 'ADD_FIELD'}
        />
      </Button>
    </div>
  );
}
