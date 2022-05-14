import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import { get } from 'lodash-es';

import fieldTypes from '../../../constants/fieldTypesNew';
import useLabel from '../../../hooks/useLabel';
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

  const intl = useIntl();
  const label = useLabel(schema);
  const placeholder = get(schema, 'placeholder');
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
        label={
          placeholder
            ? intl.formatMessage({ id: placeholder })
            : label
        }
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
