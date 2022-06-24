import React, { memo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import fieldTypes from '../../../constants/fieldTypesNew';
import useEditLabel from '../../../hooks/useEditLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';

const TextInput = function(props) {
  const {
    schema,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const isLongString = schema.fieldType === fieldTypes.longstring;
  const isNumberInput = [
    fieldTypes.integer,
    fieldTypes.float,
  ].includes(schema.fieldType);
  const type = isNumberInput ? 'number' : undefined;

  const htmlValue =
    value === null || value === undefined ? '' : value;

  return (
    <FormCore schema={schema} width={width}>
      <TextField
        id={schema.name}
        multiline={isLongString}
        maxRows={isLongString ? 5 : undefined}
        label={editLabel}
        type={type}
        onChange={e => {
          const inputValue = e.target.value;
          if (
            inputValue.match('.') &&
            schema.fieldType === fieldTypes.integer
          ) {
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
};

export default memo(TextInput);
