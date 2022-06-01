import React, { memo } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import fieldTypes from '../../../constants/fieldTypesNew';
import useEditLabel from '../../../hooks/useEditLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';
import Text from '../../Text';

const SelectionEditor = function(props) {
  const {
    schema,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;
  const intl = useIntl();
  console.log('deleteMe value is: ');
  console.log(value);
  console.log('deleteMe typeof value is: ');
  console.log(typeof value);
  const isMultiselect = schema.fieldType === fieldTypes.multiselect;
  const isAlreadyArray = Array.isArray(value);
  const makeSafeArray = val => {
    if (!val) return [];
    if (typeof val === 'string') return val?.split(',');
    return [];
  };
  const splitValues = isAlreadyArray ? value : makeSafeArray(value);

  function getLabel(object) {
    if (object?.labelId)
      return intl.formatMessage({
        id: object.labelId,
      });
    return get(object, 'label', 'Missing label');
  }

  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const choices = get(schema, 'choices', []);
  const identifier = schema.id || schema.name;

  return (
    <FormCore schema={schema} width={width}>
      <InputLabel>{editLabel}</InputLabel>
      <Select
        labelId={`${identifier}-selector-label`}
        id={`${identifier}-selector`}
        onChange={e => {
          onChange(e.target.value);
        }}
        value={isMultiselect ? splitValues : value || ''}
        multiple={isMultiselect}
        renderValue={currentValue => {
          if (isMultiselect) {
            const selectedChoices = choices.filter(c =>
              currentValue.includes(c.value),
            );
            const choiceLabels = selectedChoices.map(c =>
              getLabel(c),
            );
            return choiceLabels.join(', ');
          }
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
              minHeight: 42,
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
    </FormCore>
  );
};

export default memo(SelectionEditor);
