import React, { memo } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';

function SelectionEditor(props) {
  const {
    schema,
    value,
    onChange,
    width,
    minimalLabels = false,
    variant = 'one', // one, multiple
    ...rest
  } = props;
  const intl = useIntl();

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  const label = useLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const choices = get(schema, 'choices', []);
  const identifier = schema.id || schema.name;

  return (
    <FormCore schema={schema} width={width}>
      <InputLabel>{label}</InputLabel>
      <Select
        labelId={`${identifier}-selector-label`}
        id={`${identifier}-selector`}
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
        multiple={variant === 'multiple'}
        {...rest}
      >
        {choices.map(option => (
          <MenuItem value={option.value} key={option.value}>
            {getLabel(option)}
          </MenuItem>
        ))}
      </Select>
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
    </FormCore>
  );
}

export default memo(SelectionEditor);
