import React, { useState } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

export default function TermFilter(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    onChange,
    queryTerm,
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
            match: { [queryTerm]: e.target.value },
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
