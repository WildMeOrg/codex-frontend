import React from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import fieldTypes from '../constants/fieldTypes';
import FileInput from './inputs/FileInput';
import FeetMetersInput from './inputs/FeetMetersInput';
import IndividualInput from './inputs/IndividualInput';
import RelationshipsInput from './inputs/RelationshipsInput';
import SelectInput from './inputs/SelectInput';
import FieldSetInput from './inputs/FieldSetInput';
import BooleanInput from './inputs/BooleanInput';
import TextInput from './inputs/TextInput';
import OptionEditor from './inputs/OptionEditor';
import TreeViewInput from './inputs/TreeViewInput';
import TreeViewEditor from './inputs/TreeViewEditor';

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

export default function LabeledInput(props) {
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

  if (schema.fieldType === fieldTypes.latlong)
    return <div>Maps coming soon...</div>;

  if (schema.fieldType === fieldTypes.file) {
    return <FileInput {...props} />;
  }

  if (schema.fieldType === fieldTypes.treeview) {
    return <TreeViewInput {...props} />;
  }

  if (schema.fieldType === fieldTypes.treeeditor) {
    return <TreeViewEditor {...props} />;
  }

  if (schema.fieldType === fieldTypes.individual) {
    return <IndividualInput {...props} />;
  }

  if (schema.fieldType === fieldTypes.relationships) {
    return <RelationshipsInput {...props} />;
  }

  if (schema.fieldType === fieldTypes.optioneditor) {
    return <OptionEditor {...props} />;
  }

  if (schema.fieldType === fieldTypes.comparator) {
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
        {!minimalLabels && (
          <FormHelperText>{getDescription(schema)}</FormHelperText>
        )}
      </Core>
    );
  }

  if (schema.fieldType === fieldTypes.boolean) {
    return <BooleanInput {...props} />;
  }

  if (
    [fieldTypes.select, fieldTypes.multiselect].includes(
      schema.fieldType,
    )
  ) {
    return (
      <Core schema={schema} required={required} width={width}>
        <SelectInput {...props} />
      </Core>
    );
  }

  if (schema.fieldType === fieldTypes.fieldset) {
    return (
      <Core schema={schema} required={required} width={width}>
        <FieldSetInput {...props} />
      </Core>
    );
  }

  if (schema.fieldType === fieldTypes.date) {
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
        {!minimalLabels && (
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ marginTop: 4 }}
          >
            {getDescription(schema)}
          </Typography>
        )}
      </MuiPickersUtilsProvider>
    );
  }

  if (schema.fieldType === fieldTypes.daterange) {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Typography variant="subtitle2" style={{ marginTop: 16 }}>
          {getLabel(schema)}
        </Typography>
        {!minimalLabels && (
          <Typography
            variant="caption"
            color="textSecondary"
            style={{ marginTop: 4 }}
          >
            {getDescription(schema)}
          </Typography>
        )}
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

  if (schema.fieldType === fieldTypes.feetmeters) {
    return (
      <Core schema={schema} required={required} width={width}>
        <FeetMetersInput {...props} />
      </Core>
    );
  }

  return <TextInput {...props} {...rest} />;
}
