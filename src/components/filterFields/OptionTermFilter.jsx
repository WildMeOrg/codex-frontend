import React, { useState, memo } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Text from '../Text';

function SelectionEditor(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    filterId,
    onChange,
    queryTerm,
    choices,
    width,
    minimalLabels = false,
    style,
    ...rest
  } = props;
  const intl = useIntl();

  const [value, setValue] = useState('');

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  const showDescription =
    !minimalLabels && (description || descriptionId);

  const translatedLabel = labelId
    ? intl.formatMessage({ id: labelId })
    : label;

  return (
    <FormControl style={style}>
      <InputLabel>{translatedLabel}</InputLabel>
      <Select
        labelId={`${queryTerm}-selector-label`}
        id={`${queryTerm}-selector`}
        onChange={e => {
          const selectedValue = e.target.value;
          const selectedChoice = choices.find(
            c => c.value === selectedValue,
          );
          const choiceLabel = getLabel(selectedChoice);
          setValue(selectedValue);
          onChange({
            filterId,
            descriptor: `${translatedLabel}: ${choiceLabel}`,
            query: {
              match: { [queryTerm]: selectedValue },
            },
          });
        }}
        value={value}
        renderValue={currentValue => {
          const selectedChoice = choices.find(
            c => c.value === currentValue,
          );
          return getLabel(selectedChoice);
        }}
        {...rest}
      >
        {choices.map(option => (
          <MenuItem
            value={option.value}
            key={option.value}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text component="span">{getLabel(option)}</Text>
            {option.description ? (
              <Text component="span" variant="caption">
                {option.description}
              </Text>
            ) : (
              undefined
            )}
          </MenuItem>
        ))}
      </Select>
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
    </FormControl>
  );
}

export default memo(SelectionEditor);
