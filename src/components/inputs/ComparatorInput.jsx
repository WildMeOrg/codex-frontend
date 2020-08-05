import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

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

export default function ComparatorInput(props) {
  const {
    schema,
    required,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

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
    <Core
      schema={schema}
      required={required}
      width={width}
      style={{ marginTop: 12 }}
    >
      <Typography>{getLabel(schema)}</Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          labelId={`${schema.name}-comparator-label`}
          id={`${schema.name}-comparator`}
          onChange={e => {
            onChange(e.target.value);
            onChange({
              comparator: e.target.value,
              value: value.value,
            });
          }}
          value={value.comparator}
          style={{ width: 60 }}
          {...rest}
        >
          <MenuItem value="GT">&gt;</MenuItem>
          <MenuItem value="GTE">≥</MenuItem>
          <MenuItem value="EQ">=</MenuItem>
          <MenuItem value="LTE">≤</MenuItem>
          <MenuItem value="LT">&lt;</MenuItem>
        </Select>
        <TextField
          style={{ marginLeft: 8, width: '100%' }}
          id={schema.name}
          onChange={e => {
            onChange({
              comparator: value.comparator,
              value: e.target.value,
            });
          }}
          value={value.value}
        />
      </div>
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </Core>
  );
}
