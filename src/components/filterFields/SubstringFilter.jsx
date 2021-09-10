import React, { useState } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

export default function SubstringFilter(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    onChange,
    queryTerms,
    width,
    minimalLabels = false,
    ...rest
  } = props;
  const showDescription = !minimalLabels && description;

  const [value, setValue] = useState('');

  return (
    <FormControl>
      <TextField
        label={label}
        onChange={e => {
          setValue(e.target.value);
          onChange({
            query_string: {
              query: `*${e.target.value}*`,
              fields: queryTerms,
            },
          });
        }}
        value={value}
        {...rest}
      />
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
