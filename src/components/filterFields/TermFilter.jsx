import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

export default function TermFilter(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    filterId,
    onChange,
    queryTerm,
    width,
    minimalLabels = false,
    style = {},
    ...rest
  } = props;
  const intl = useIntl();
  const showDescription = !minimalLabels && description;

  const [value, setValue] = useState('');
  const translatedLabel = labelId
    ? intl.formatMessage({ id: labelId })
    : label;

  return (
    <FormControl style={style}>
      <TextField
        label={translatedLabel}
        onChange={e => {
          const inputValue = e.target.value;
          setValue(inputValue);
          onChange({
            filterId,
            descriptor: `${translatedLabel}: ${inputValue}`,
            query: {
              match: { [queryTerm]: inputValue.toLowerCase() },
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
