import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { deriveIndividualName } from '../../utils/nameUtils';
import sexOptions from '../../constants/sexOptions';
import { get, startCase } from 'lodash-es';
import useSiteSettings from '../../models/site/useSiteSettings';

const validSexOptions = sexOptions.filter(o => o.value);


export default function ResolutionSelector({
  value,
  onChange,
  fieldType,
  individualData,
}) {
    
  const { data, loading, error } = useSiteSettings();
  const species = get(data, ['site.species', 'value'], []);
  const speciesOptions = species.map(s => {
    const mainCommonName = startCase(get(s, ['commonNames', 0]));
    const speciesLabel = mainCommonName
      ? `${mainCommonName} (${s.scientificName})`
      : s.scientificName;
    return {
      label: speciesLabel,
      value: s.id,
    };
  }); 
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
    taxonomy: {
      labelId: 'taxonomy',
      getProperty: individualData => individualData?.taxonomy,
      deriveChoices: species =>
        species.map(data => ({
          label: speciesOptions.map(data1 => data1.value === data ? data1.label : ''),
          value: data,
        })),
    },
  };
  const selectorSchema = propertyMap[fieldType];
  const individualProperties = Object.values(individualData).map(
    individual => selectorSchema.getProperty(individual),
  );
  const choices = useMemo(() => {
    if (individualProperties?.length === 0) return [];
    return selectorSchema.deriveChoices(individualProperties);
  }, [selectorSchema, individualProperties]);

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
