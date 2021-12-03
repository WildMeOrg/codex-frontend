import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { get } from 'lodash-es';
import Text from '../../Text';
import useDescription from '../../../hooks/useDescription';
import useLabel from '../../../hooks/useLabel';
import FormCore from './FormCore';

export default function LocationIdEditor(props) {
  const {
    schema,
    required,
    onChange,
    width,
    value,
    multiple,
    minimalLabels = false,
    ...rest
  } = props;

  const label = useLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  function getNumDescendents(targetChoice) {
    let result = 0;
    if (!targetChoice.locationID) return result;
    const childCountsArr = targetChoice.locationID.map(child =>
      getNumDescendents(child),
    );
    result =
      targetChoice.locationID.length +
      childCountsArr.reduce((a, b) => a + b, 0);
    return result;
  }

  function collapseChoices(choices, depth) {
    const result = choices.map(choice => {
      const numDescendants = getNumDescendents(choice);
      const numDescendantsAsString = numDescendants
        ? ` (${numDescendants})`
        : '';
      if (!choice.locationID) {
        return {
          depth,
          name: choice.name + numDescendantsAsString,
          id: choice.id,
        };
      }
      const subchoices = [
        {
          depth,
          name: choice.name + numDescendantsAsString,
          id: choice.id,
        },
      ];
      subchoices.push(collapseChoices(choice.locationID, depth + 1));
      return subchoices;
    });
    return result.flat(100);
  }

  return (
    <FormCore schema={schema} width={width}>
      <Autocomplete
        options={collapseChoices(schema.choices, 0)}
        renderOption={option => (
          <Text
            style={{ paddingLeft: option.depth * 10 }}
            value={option.id}
          >
            {option.name}
          </Text>
        )}
        onChange={(_, newValue) => {
          if (multiple) {
            onChange(
              newValue.map(location => get(location, 'id', '')),
            );
          } else {
            onChange(get(newValue, 'id', ''));
          }
        }}
        getOptionLabel={option => get(option, 'name', '')}
        getOptionSelected={(option, val) => {
          console.log('deleteMe option is: ');
          console.log(option);
          console.log('deleteMe val in LocationIdEditor is: ');
          console.log(val);
          option.id ? option.id === get(val, 'id') : false;
        }}
        renderInput={params => (
          <TextField
            {...params}
            style={{ width: 280 }}
            variant="standard"
            label={label}
          />
        )}
        multiple={multiple}
        {...rest}
      />
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
    </FormCore>
  );
}
