import React, { memo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';

function TextInput(props) {
  const {
    schema,
    value,
    onChange,
    width,
    minimalLabels = false,
    variant, // float, integer, longstring, string
    ...rest
  } = props;

  const label = useLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const isNumberInput = ['float', 'integer'].includes(variant);
  const type = isNumberInput ? 'number' : undefined;

  const htmlValue =
    value === null || value === undefined ? '' : value;

  return (
    <FormCore schema={schema} width={width}>
      <TextField
        id={schema.name}
        multiline={variant === 'longstring'}
        rowsMax={variant === 'longstring' ? 5 : undefined}
        label={label}
        type={type}
        onChange={e => {
          const inputValue = e.target.value;
          if (inputValue.match('.') && variant === 'integer') {
            onChange(parseInt(inputValue, 10));
          } else {
            onChange(inputValue);
          }
        }}
        value={htmlValue}
        {...rest}
      />
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
    </FormCore>
  );
}

export default memo(TextInput);
