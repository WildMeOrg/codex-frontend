import React from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

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

export default function LabeledInput({
  schema,
  required,
  value,
  onChange,
  width,
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

  if (schema.fieldType === 'latlong')
    return <div>Maps coming soon...</div>;

  if (schema.fieldType === 'comparator') {
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
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      </Core>
    );
  }

  if (schema.fieldType === 'boolean') {
    return (
      <Core required={required} schema={schema} width={width}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography>{getLabel(schema)}</Typography>
          <Switch
            checked={value}
            onChange={e => {
              onChange(e.target.checked);
            }}
          />
        </div>

        <FormHelperText style={{ marginTop: 0 }}>
          {getDescription(schema)}
        </FormHelperText>
      </Core>
    );
  }

  if (['select', 'multiselect'].includes(schema.fieldType)) {
    return (
      <Core schema={schema} required={required} width={width}>
        <InputLabel>{getLabel(schema)}</InputLabel>
        <Select
          labelId={`${schema.name}-selector-label`}
          id={`${schema.name}-selector`}
          onChange={e => {
            onChange(e.target.value);
          }}
          value={value}
          multiple={schema.fieldType === 'multiselect'}
        >
          {schema.choices.map(option => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      </Core>
    );
  }

  if (schema.fieldType === 'date') {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id={`${getLabel(schema)}-date-input`}
          label={getLabel(schema)}
          value={value}
          onChange={onChange}
          style={{ margin: 0, width }}
          KeyboardButtonProps={{
            'aria-label': `${getLabel(schema)} input`,
          }}
        />
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ marginTop: 4 }}
        >
          {getDescription(schema)}
        </Typography>
      </MuiPickersUtilsProvider>
    );
  }

  if (schema.fieldType === 'daterange') {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Typography variant="subtitle2" style={{ marginTop: 16 }}>
          {getLabel(schema)}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ marginTop: 4 }}
        >
          {getDescription(schema)}
        </Typography>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id={`${getLabel(schema)}-start-date`}
          label={<FormattedMessage id="START_DATE" />}
          value={value[0]}
          onChange={nextStartDate => {
            onChange([nextStartDate, value[1]]);
          }}
          style={{ margin: 0 }}
          KeyboardButtonProps={{
            'aria-label': `Change ${getLabel(schema)} start date`,
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id={`${getLabel(schema)}-end-date`}
          label={<FormattedMessage id="END_DATE" />}
          value={value[1]}
          onChange={nextEndDate => {
            onChange([value[0], nextEndDate]);
          }}
          style={{ margin: 0 }}
          KeyboardButtonProps={{
            'aria-label': `Change ${getLabel(schema)} end date`,
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  return (
    <Core schema={schema} required={required} width={width}>
      <TextField
        id={schema.name}
        multiline={schema.fieldType === 'longstring'}
        label={getLabel(schema)}
        type={
          ['float', 'integer'].includes(schema.fieldType)
            ? 'number'
            : 'undefined'
        }
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
      />
      <FormHelperText>{getDescription(schema)}</FormHelperText>
    </Core>
  );
}
