import React from 'react';
import { FormattedMessage } from 'react-intl';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { deriveIndividualName } from '../../utils/nameUtils';
import sexOptions from '../../constants/sexOptions';

const validSexOptions = sexOptions.filter(o => o.value);

const propertyMap = {
  sex: {
    labelId: 'SEX',
    getProperty: individualData => individualData?.sex,
    deriveChoices: sexes =>
      validSexOptions.filter(o => sexes.includes(o.value)),
  },
  firstName: {
    labelId: 'FIRST_NAME',
    getProperty: individualData =>
      deriveIndividualName(individualData, 'FirstName'),
    deriveChoices: names =>
      names.map(name => ({
        label: name,
        value: name,
      })),
  },
  adoptionName: {
    labelId: 'ADOPTION_NAME',
    getProperty: individualData =>
      deriveIndividualName(individualData, 'AdoptionName'),
    deriveChoices: names =>
      names.map(name => ({
        label: name,
        value: name,
      })),
  },
};

export default function ResolutionSelector({
  value,
  onChange,
  fieldType,
  individualData,
}) {
  const selectorSchema = propertyMap[fieldType];
  const individualProperties = individualData.map(individual =>
    selectorSchema.getProperty(individual),
  );
  const choices = selectorSchema.deriveChoices(individualProperties);

  return (
    <FormControl style={{ width: 320, marginTop: 12 }}>
      <InputLabel>
        <FormattedMessage id={selectorSchema.labelId} />
        {' *'}
      </InputLabel>
      <Select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        {choices.map(choice => (
          <MenuItem key={choice?.value} value={choice?.value}>
            {choice?.labelId ? (
              <FormattedMessage id={choice.labelId} />
            ) : (
              choice?.label
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
