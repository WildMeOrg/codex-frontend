import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

// https://lowrey.me/test-if-a-string-is-alphanumeric-in-javascript/
const isAlphaNumeric = ch => ch.match(/^[a-z0-9]+$/i) !== null;

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

function ProjectIdInput(props) {
  const { schema, required, value, onChange, width, ...rest } = props;

  const intl = useIntl();

  const htmlValue =
    value === null || value === undefined ? '' : value;

  return (
    <Core schema={schema} required={required} width={width}>
      <TextField
        id={schema.name}
        label={intl.formatMessage({ id: 'PROJECT_ID' })}
        onChange={e => {
          const inputValue = e.target.value;
          const transformedValue = inputValue.toUpperCase();
          const valid =
            inputValue.length <= 5 && isAlphaNumeric(inputValue);
          const empty = inputValue === '';

          if (empty || valid) onChange(transformedValue);
        }}
        value={htmlValue}
        {...rest}
      />
    </Core>
  );
}

export default memo(ProjectIdInput);
