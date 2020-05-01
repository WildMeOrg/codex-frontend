import React, { useState } from 'react';
import { get, round } from 'lodash-es';
import { useIntl } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function FeetMetersInput({
  schema,
  required,
  value,
  onChange,
  width,
  ...rest
}) {
  const intl = useIntl();
  const choices = [
    intl.formatMessage({ id: 'FEET' }),
    intl.formatMessage({ id: 'METERS' }),
  ];

  const [unit, setUnit] = useState('meters');

  const initialValue = unit === 'feet' ? value * 3.28084 : value;
  const [displayValue, setDisplayValue] = useState(initialValue);

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', ...rest }}>
      <TextField
        id={schema.name}
        label={getLabel(schema)}
        type="number"
        onChange={e => {
          onChange(e.target.value);
          const typedValue = e.target.value;
          const newValue =
            unit === 'feet' ? typedValue * 0.3048 : typedValue;
          onChange(newValue);
          setDisplayValue(round(typedValue, 2));
        }}
        value={displayValue}
      />
      <Select
        id="unit-selector"
        onChange={() => {
          if (unit === 'feet') {
            setUnit('meters');
            setDisplayValue(round(displayValue * 0.3048, 2));
          }
          if (unit === 'meters') {
            setUnit('feet');
            setDisplayValue(round(displayValue * 3.28084, 2));
          }
        }}
        value={unit}
      >
        {choices.map(option => (
          <MenuItem value={option} key={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
