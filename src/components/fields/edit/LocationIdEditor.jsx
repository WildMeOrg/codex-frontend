import React, { useEffect, useMemo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { get } from 'lodash-es';
import Radio from '@material-ui/core/Radio';
import useDescription from '../../../hooks/useDescription';
import useEditLabel from '../../../hooks/useEditLabel';
import FormCore from './FormCore';
import { collapseChoices } from '../../../utils/formatters';
import { set } from 'date-fns';

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

  console.log(get(schema, 'choices', []), 0)

  const currentRegionArray = value
    ? collapsedChoices.filter(choice => get(choice, 'id') === value)
    : null;
  const currentRegion = get(currentRegionArray, [0], null);
  console.log("currentRegion", currentRegion);

  const [subRegion, setSubRegion] = React.useState([]);

  useEffect(() => { 
    if(collapsedChoices?.length && currentRegion) {
      console.log("======>>>>>>>>>",collapsedChoices);
      const selectedIndex = collapsedChoices?.findIndex(data => data.id === currentRegion.id);
      console.log("selectedIndex", selectedIndex);
      const subRegion1 = [];

      for (let i = selectedIndex + 1; i < collapsedChoices?.length; i++) {
        const currentOption = collapsedChoices[i];  
        if (currentOption.depth > currentRegion?.depth) {
          subRegion1.push(currentOption);
          
        } else if (currentOption.depth <= currentRegion.depth) {
          break;
        }
      }

      setSubRegion(subRegion1);

  console.log("subRegion", subRegion);
    }
    
  

  }, [currentRegion]);


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
            .includes(inputValue.toLowerCase() || 'A');
            // console.log("option", option);
          

          return (
            <>
              <Radio
                style={{
                  paddingLeft: option.depth * 10,
                }}
                checked={selected}
                value={option.id}
                // onChange={() => {}}
                color="primary"
                size="small"
                // inputProps={{ 'aria-labelledby': option.id }}
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
