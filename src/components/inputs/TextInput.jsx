import React from 'react';
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
    return get(object, 'label', undefined);
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
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
        {...rest}
      />
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </Core>
  );
}
