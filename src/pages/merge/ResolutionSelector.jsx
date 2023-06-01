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
  // individualData,
}) {

  const individualData = {"123233": 
  {
      
      "names": [
          {
              "context": "FirstName",
              "elasticsearchable": false,
              "indexed": "2023-05-30T19:16:29.193943+00:00",
              "guid": "b5468eb7-2f01-432f-ad59-a5cb644e6f7122222",
              "creator": {
                  "full_name": "Erin",
                  "profile_fileupload": null,
                  "guid": "65362056-c22a-4d8c-986c-30954ad10bc511111"
              },
              "value": null,
              "preferring_users": []
          }
      ],
      "featuredAssetGuid": "2868250a-0be6-4fb4-9720-7e837b901893",
      "sex": "male",    
      "guid": "4050f325-caa5-4f60-bcd1-7700b65ee245",
      "hasView": true,
      "updated": "2023-06-01T17:12:58.128646+00:00",
      "taxonomy": null,    
      "created": "2023-05-22T19:30:09.771763+00:00"
  }
,

"78789789": 
  {
      
      "names": [
          {
              "context": "FirstName",
              "elasticsearchable": false,
              "indexed": "2023-05-30T19:16:29.193943+00:00",
              "guid": "b5468eb7-2f01-432f-ad59-a5cb644e6f71",
              "creator": {
                  "full_name": "Erin",
                  "profile_fileupload": null,
                  "guid": "65362056-c22a-4d8c-986c-30954ad10bc5"
              },
              "value": "victoria",
              "preferring_users": []
          }
      ],
      "featuredAssetGuid": "2868250a-0be6-4fb4-9720-7e837b901893",
      "sex": "male",    
      "guid": "4050f325-caa5-4f60-bcd1-7700b65ee245",
      "hasView": true,
      "updated": "2023-06-01T17:12:58.128646+00:00",
      "taxonomy": '1-2-3-4-5',    
      "created": "2023-05-22T19:30:09.771763+00:00"
  
}}
    
  console.log("individualData in selector",individualData);
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
      labelId: 'SPECIES',
      getProperty: individualData => individualData?.taxonomy,
      deriveChoices: species => {
        if(species.length === 0) return speciesOptions;
        return species.filter(data => data!== null && data !== undefined).map(data => {
          const speciesLabel = speciesOptions.find(data1 => data1.value === data);
          return ({
            label: speciesLabel ? speciesLabel.label : 'Label not found',
            value: data,
          })
        })
      }
    },
  };
  const selectorSchema = propertyMap[fieldType];
  console.log("individualData",Object.values(individualData));
  
  const individualProperties = Object.values(individualData).map(
    individual => selectorSchema.getProperty(individual),
  );
  console.log("individualProperties",individualProperties)
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
