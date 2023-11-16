import React, { useMemo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { get } from 'lodash-es';
import Radio from '@material-ui/core/Radio';
import useDescription from '../../../hooks/useDescription';
import useEditLabel from '../../../hooks/useEditLabel';
import FormCore from './FormCore';
import { collapseChoices } from '../../../utils/formatters';

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

  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const collapsedChoices = useMemo(
    () => collapseChoices(get(schema, 'choices', []), 0),
    [get(schema, 'choices.length')],
  );

  const currentRegionArray = value
    ? collapsedChoices.filter(choice => get(choice, 'id') === value)
    : null;
  const currentRegion = get(currentRegionArray, [0], null);

  const filterOptions = (options, { inputValue }) => {
    console.log('options', options);
    console.log('inputValue', inputValue);

    if (inputValue) {
      // const filteredOptions = options.filter(option =>
      //   option.name.toLowerCase().includes(inputValue.toLowerCase())
      // );

      return options;
    }

    return options;
  };

  return (
    <FormCore schema={schema} width={width}>
      <Autocomplete
        value={currentRegion}
        options={collapsedChoices}
        disableCloseOnSelect
        filterOptions={filterOptions}
        // renderOption={option => (
        //   <Text
        //     style={{ paddingLeft: option.depth * 10 }}
        //     value={option.id}
        //   >
        //     {option.name}
        //   </Text>
        // )}
        renderOption={(option, { selected, inputValue }) => {
          const searchResult = option.name
            .toLowerCase()
            .includes(inputValue.toLowerCase());

          return (
            <>
              <Radio
                style={{
                  paddingLeft: option.depth * 10,
                  fontSize: 5,
                }}
                checked={selected || searchResult}
                value={option.id}
                onChange={() => {}}
                color="primary"
                inputProps={{ 'aria-labelledby': option.id }}
              />
              {searchResult ? (
                <span
                  style={{
                    fontSize: 42,
                    paddingLeft: option.depth * 10,
                  }}
                >
                  {option.name}
                </span>
              ) : (
                <span style={{ paddingLeft: option.depth * 10 }}>
                  {option.name}
                </span>
              )}
            </>
          );
        }}
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
        getOptionSelected={option =>
          option.id ? option.id === get(currentRegion, 'id') : false
        }
        renderInput={params => (
          <div>
            <TextField
              {...params}
              style={{ width: 280 }}
              variant="standard"
              label={editLabel}
            />
          </div>
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
