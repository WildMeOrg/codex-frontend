import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '../Button';
import useSiteSettings from '../../models/site/useSiteSettings';

export default function autogenNameFilter(props) {
  const {
    label,
    labelId,
    description,
    descriptionId,
    filterId,
    onChange,
    queryTerms,
    width,
    nested = false,
    clause = 'filter',
    default_operator = 'AND',
    minimalLabels = false,
    style = {},
    ...rest
  } = props;
  const {data} = useSiteSettings();
  const contextArray = Object.keys(data?.autogenerated_names?.value);
  
  // const contextArray = [];
  // const autogen_names_object =  data?.autogenerated_names?.value;
  // Object.keys(autogen_names_object).map((key) => {
  //   if(autogen_names_object[key].type === "auto_species") {
  //     contextArray.push(key);
  //   }
  // });

  const intl = useIntl();

  const showDescription = !minimalLabels && description;

  const [value, setValue] = useState('');
  const translatedLabel = labelId
    ?   (intl.messages[labelId]
      ? intl.formatMessage({ id: labelId })
      : labelId )
    : label; 

  const query =  contextArray.map((data) => {
    return {
      "wildcard" : {
        [`${queryTerms}.autogen-${data}`] : `*${value}*`
     }
    }    
 })

  return (
    <div
      style={{ display: 'flex', alignItems: 'flex-end', ...style }}
    >
      <FormControl>
        <TextField
          label={translatedLabel}
          onChange={e => {
            setValue(e.target.value);
          }}
          value={value}
          {...rest}
        />
        {showDescription ? (
          <FormHelperText>{description}</FormHelperText>
        ) : null}
      </FormControl>
      <Button
        id="GO"
        onClick={() =>
          onChange({
            filterId,
            descriptor: `${translatedLabel}: ${value}`,
            nested,
            clause,            
            query : {              
                       "bool" : {
                          "should" : query
                       }
                    }                 
          })
        }

        size="small"
        style={{ marginLeft: 8, minWidth: 48, height: 36 }}
      />
    </div>
  );
}
