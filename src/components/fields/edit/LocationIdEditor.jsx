import React, { useMemo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { get } from 'lodash-es';
import Text from '../../Text';
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

  return (
    <FormCore schema={schema} width={width}>
      <Autocomplete
        value={currentRegion}
        options={collapsedChoices}
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
        renderInput={params => (
          <TextField
            {...params}
            style={{ width: 280 }}
            variant="standard"
            label={editLabel}
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
