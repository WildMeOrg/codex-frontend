import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import useOnEnter from '../../hooks/useOnEnter';
import Button from '../Button';
import Text from '../Text';

const comparators = [
  {
    label: 'Greater than',
    value: 'gt',
    getDescriptor: value => `More than ${value} sightings`,
  },
  {
    label: 'Greater than or equal to',
    value: 'gte',
    getDescriptor: value => `At least ${value} sightings`,
  },
  {
    label: 'Less than',
    value: 'lt',
    getDescriptor: value => `Fewer than ${value} sightings`,
  },
  {
    label: 'Less than or equal to',
    value: 'lte',
    getDescriptor: value => `No more than ${value} sightings`,
  },
  {
    label: 'Equals',
    value: 'eq',
    getDescriptor: value => `Exactly ${value} sightings`,
  },
];

export default function FloatFilter({
  label,
  labelId,
  description,
  descriptionId,
  filterId,
  queryTerm,
  onChange,
  ...rest
}) {
  const intl = useIntl();
  const fieldLabel = labelId    
    ?   (intl.messages[labelId]
         ? intl.formatMessage({ id: labelId })
         : labelId )
    : label; 

  const [floatInput, setFloatInput] = useState('');
  const [comparator, setComparator] = useState('gt');

  const inputId = `${fieldLabel}-number-input`;

  function updateFilter() {
    const floatValue = parseFloat(floatInput);
    const comparatorObject = comparators.find(
      c => c.value === comparator,
    );
    const descriptor = comparatorObject.getDescriptor(floatValue);
    onChange({
      filterId,
      descriptor,
      clause: 'filter',
      query: {
        range: {
          [queryTerm]: {
            [comparator]: floatValue,
          },
        },
      },
    });
  }

  useOnEnter(e => {
    if (e.target.id === inputId) updateFilter();
  });

  return (
    <div>
      <Text variant="subtitle2" style={{ marginTop: 16 }}>
        {fieldLabel}
      </Text>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <FormControl style={{ width: '100%' }}>
          <Select
            id="comparator-selector"
            onChange={e => setComparator(e.target.value)}
            value={comparator}
            size="small"
          >
            {comparators.map(c => (
              <MenuItem key={c.label} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          autoFocus
          id={inputId}
          placeholder="Count"
          size="small"
          value={floatInput}
          onChange={e => {
            const inputValue = e.target.value;
            const isPositiveFloat = /^[+]?\d*\.?\d*$/.test(
              inputValue,
            );
            if (isPositiveFloat || inputValue === '') {
              setFloatInput(e.target.value);
            }
          }}
          style={{
            width: 148,
            marginLeft: 8,
          }}
          {...rest}
        />
        <Button
          size="small"
          style={{ marginLeft: 8, minWidth: 48, height: 36 }}
          onClick={updateFilter}
          id="GO"
        />
      </div>
    </div>
  );
}