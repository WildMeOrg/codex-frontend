import React, { memo } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

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

function TextInput(props) {
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
    return get(object, 'label', undefined);
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  let type = 'undefined';
  if (['float', 'integer'].includes(schema.fieldType))
    type = 'number';
  if (schema.fieldType === 'password') type = 'password';

  return (
    <Core schema={schema} required={required} width={width}>
      <TextField
        id={schema.name}
        multiline={schema.fieldType === 'longstring'}
        rowsMax={schema.fieldType === 'longstring' ? 5 : undefined}
        label={getLabel(schema)}
        type={type}
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
        {...rest}
      />
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </Core>
  );
}

export default memo(TextInput);
