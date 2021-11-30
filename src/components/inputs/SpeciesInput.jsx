import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Text from '../Text';

const Core = function({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
};

export default function SpeciesInput({
  choices,
  required,
  value,
  onChange,
  width = 280,
  ...rest
}) {
  return (
    <Core required={required} width={width}>
      <InputLabel>Species</InputLabel>
      <Select
        labelId="species-selector-label"
        id="species-selector"
        onChange={e => {
          onChange(e.target.value);
        }}
        value={value}
        {...rest}
      >
        {choices.map(option => (
          <MenuItem value={option.id} key={option.id}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text>{option.scientificName}</Text>
              <Text
                variant="body2"
                style={{
                  fontStyle: 'italic',
                  maxWidth: 240,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {option.commonNames.join(', ')}
              </Text>
            </div>
          </MenuItem>
        ))}
      </Select>
    </Core>
  );
}
