import React, { useState, memo } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Text from '../Text';

const OptionTermFilter = function(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    filterId,
    onChange,
    onClearFilter,
    queryTerm,
    queryType = 'match',
    choices,
    width,
    minimalLabels = false,
    nested = false,
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

  const safeChoices = choices || [];

  return (
    <FormControl style={style}>
      <InputLabel>{translatedLabel}</InputLabel>
      <Select
        labelId={`${queryTerm}-selector-label`}
        id={`${queryTerm}-selector`}
        onChange={e => {
          const selectedValue = e.target.value;
          const selectedChoice = safeChoices.find(
            c => c.value === selectedValue,
          );
          const choiceLabel = getLabel(selectedChoice);
          const choiceValue = get(
            selectedChoice,
            'queryValue',
            selectedValue,
          );
          setValue(selectedValue);
          if (selectedValue === '') {
            onClearFilter(filterId);
          } else {
            onChange({
              filterId,
              nested,
              clause: get(selectedChoice, 'clause', 'filter'),
              descriptor: `${translatedLabel}: ${choiceLabel}`,
              query: {
                [queryType]: { [queryTerm]: choiceValue },
              },
            });
          }
        }}
        value={value}
        renderValue={currentValue => {
          const selectedChoice = safeChoices.find(
            c => c.value === currentValue,
          );
          return getLabel(selectedChoice);
        }}
        {...rest}
      >
        {safeChoices.map(option => (
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
};

export default memo(OptionTermFilter);
