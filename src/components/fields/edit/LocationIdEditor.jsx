import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import Text from '../../Text';

export default function LocationIdEditor(props) {
  const {
    schema,
    required,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

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
      const numDescendantsAsString = numDescendants ? `(${numDescendants})` : '';
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
    <Autocomplete
      multiple
      options={collapseChoices(schema.choices, 0)}
      renderOption={option => (
        <Text
          style={{ paddingLeft: option.depth * 10 }}
          value={option.id}
        >
          {option.name}
        </Text>
      )}
      onChange={(event, newValue) => {
        onChange(newValue[0].id);
      }}
      getOptionLabel={option => option.name}
      getOptionSelected={(option, val) => option.id === val.id}
      renderInput={params => (
        <TextField
          {...params}
          style={{ width: 280 }}
          variant="standard"
          label={<FormattedMessage id="REGION_SELECT" />}
        />
      )}
    />
  );
}
