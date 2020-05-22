import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

export default function LabeledInput({
  schema,
  required,
  value,
  onChange,
  minimalLabels = false,
  ...rest
}) {
  const intl = useIntl();

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  return (
    <>
      <InputLabel>{getLabel(schema)}</InputLabel>
      <Select
        labelId={`${schema.name}-selector-label`}
        id={`${schema.name}-selector`}
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
        multiple={schema.fieldType === 'multiselect'}
        {...rest}
      >
        {schema.choices.map(option => (
          <MenuItem value={option.value} key={option.value}>
            {getLabel(option)}
          </MenuItem>
        ))}
      </Select>
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </>
  );
}
