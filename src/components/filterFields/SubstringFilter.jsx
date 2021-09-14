import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '../Button';

export default function SubstringFilter(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    filterId,
    onChange,
    queryTerms,
    width,
    nested = false,
    clause = 'filter',
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
    <div
      style={{ display: 'flex', alignItems: 'flex-end', ...style }}
    >
      <FormControl>
        <TextField
          label={translatedLabel}
          onChange={e => {
            setValue(e.target.value);
          }}
          value={value}
          {...rest}
        />
        {showDescription ? (
          <FormHelperText>{description}</FormHelperText>
        ) : null}
      </FormControl>
      <Button
        id="GO"
        onClick={() =>
          onChange({
            filterId,
            descriptor: `${translatedLabel}: ${value}`,
            nested,
            clause,
            query: {
              query_string: {
                query: `*${value.toLowerCase()}*`,
                fields: queryTerms,
              },
            },
          })
        }
        size="small"
        style={{ marginLeft: 8, minWidth: 48, height: 36 }}
      />
    </div>
  );
}
