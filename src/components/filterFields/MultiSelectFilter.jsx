import React, { useState, memo } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Text from '../Text';

const MultiSelectFilter = function (props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    filterId,
    onChange,
    onClearFilter,
    queryTerm,
    queryType = 'terms',
    choices,
    width,
    minimalLabels = false,
    nested = false,
    style,
    ...rest
  } = props;
  const intl = useIntl();

  const [values, setValues] = useState([]);

  function getLabel(object) {
    if (object?.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  const showDescription =
    !minimalLabels && (description || descriptionId);

  const translatedLabel = labelId
    ?   (intl.messages[labelId]
      ? intl.formatMessage({ id: labelId })
      : labelId )
    : label; 

  const safeChoices = choices || [];

  return (
    <FormControl style={style}>
      <InputLabel>{translatedLabel}</InputLabel>
      <Select
        labelId={`${queryTerm}-selector-label`}
        id={`${queryTerm}-selector`}
        multiple
        onChange={e => {
          const selectedValues = e.target.value;
          const selectedChoices = safeChoices.filter(option =>
            selectedValues.includes(option.value)
          );
          const choiceLabels = selectedChoices.map(getLabel);
          const choiceValues = selectedChoices.map(selectedChoice =>
            get(selectedChoice, 'queryValue', selectedChoice.value)
          );

          setValues(selectedValues);
          if (selectedValues.length === 0) {
            onClearFilter(filterId);
          } else {
            onChange({
              filterId,
              nested,
              clause: 'filter',
              descriptor: `${translatedLabel}: ${choiceLabels.join(', ')}`,
              query: {
                [queryType]: { [queryTerm]: choiceValues.map(data => data.toLowerCase()) },
              },
            });
          }
        }}        
        value={values}
        renderValue={currentValue => {
        if (!currentValue) {
            return '';
          }
          const selectedChoices = safeChoices.filter(option =>
            currentValue.includes(option.value)
          );
          const choiceLabels = selectedChoices.map(getLabel);
          return choiceLabels.join(', ');
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
            ) : undefined}
          </MenuItem>
        ))}
      </Select>
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default memo(MultiSelectFilter);