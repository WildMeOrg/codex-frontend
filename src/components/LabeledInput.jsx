import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

function Core({ children, required, width }) {
  return (
    <FormControl required={required} style={{ width: width || 280 }}>
      {children}
    </FormControl>
  );
}

export default function LabeledInput({
  schema,
  required,
  value,
  onChange,
  width,
}) {
  const intl = useIntl();

  if (schema.type === 'enum') {
    return (
      <Core schema={schema} required={required} width={width}>
        <InputLabel>
          <FormattedMessage id={schema.translationId} />
        </InputLabel>
        <Select
          labelId={`${schema.name}-selector-label`}
          id={`${schema.name}-selector`}
          onChange={onChange}
          value={value}
        >
          {schema.values.map(option => (
            <MenuItem value={option} key={option}>{option}</MenuItem>
          ))}
        </Select>
      </Core>
    );
  }

  return (
    <Core schema={schema} required={required} width={width}>
      <TextField
        id={schema.name}
        multiline={schema.type === 'longstring'}
        label={intl.formatMessage({ id: schema.translationId })}
        type={schema.type === 'number' ? 'number' : 'undefined'}
        onChange={onChange}
        value={value}
      />
    </Core>
  );
}
