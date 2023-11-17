import React, { useEffect, useMemo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { filter, get } from 'lodash-es';
import Radio from '@material-ui/core/Radio';
import useDescription from '../../../hooks/useDescription';
import useEditLabel from '../../../hooks/useEditLabel';
import FormCore from './FormCore';
import { collapseChoices } from '../../../utils/formatters';
import { flattenDeep } from 'lodash-es';
import { set, sub } from 'date-fns';
import { useState } from 'react';
import TreeViewDemo from './TreeViewDemo';
import Button from '../../Button';
import { FormattedMessage } from 'react-intl';


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

  const [modalOpen, setModalOpen] = useState(false);

  // function getSubRegion(selectedRegion) {
  //   const selectedIndex = collapsedChoices?.findIndex(data => data.id === selectedRegion.id);
  //     const subRegion = [];

  //     for (let i = selectedIndex + 1; i < collapsedChoices?.length; i++) {
  //       const currentOption = collapsedChoices[i];  
  //       if (currentOption.depth > selectedRegion?.depth) {
  //         subRegion.push(currentOption);          
  //       } else if (currentOption.depth <= selectedRegion.depth) {
  //         break;
  //       }
  //     }
  //     return subRegion;
  // }

  // const filterOptions = (options, { inputValue }) => {
  //   const subRegion = [];
  //   if (inputValue) {
  //     const filteredOptions = options.filter(option =>
  //       option.name.toLowerCase().includes(inputValue.toLowerCase())
  //     );
      
  //     if (filteredOptions) {
  //       filteredOptions.forEach(data => {
  //         subRegion.push(data);
  //         subRegion.push(...getSubRegion(data));
  //         console.log('subRegion', subRegion);
  //       });
        
  //     }    
  //     const uniqueArray = Array.from(new Set(subRegion.map(obj => obj.id)))
  //      .map(id => subRegion.find(obj => obj.id === id));
  //     console.log('uniqueArray', uniqueArray);
  //     return uniqueArray
    
  //   }

  //   return options;
  // };

  // return (
  //   <FormCore schema={schema} width={width}>
  //     <Autocomplete
  //       value={currentRegion}
  //       options={collapsedChoices}
  //       disableCloseOnSelect
  //       // filterOptions={filterOptions}        
  //       // renderOption={option => (
  //       //   <Text
  //       //     style={{ paddingLeft: option.depth * 10 }}
  //       //     value={option.id}
  //       //   >
  //       //     {option.name}
  //       //   </Text>
  //       // )}
  //       renderOption={(option, { selected, inputValue }) => {
  //         // const searchResult = option.name
  //         //   .toLowerCase()
  //         //   .includes(inputValue.toLowerCase() || 'A');
          

  //         return (
  //           <>
  //             <Radio
  //               style={{
  //                 paddingLeft: option.depth * 10,
  //               }}
  //               checked={selected}
  //               value={option.id}
  //               onChange={() => {}}
  //               color="primary"
  //               size="small"
  //               inputProps={{ 'aria-labelledby': option.id }}
  //             />

  //               <span                   
  //                 style={{ paddingLeft: option.depth * 10 }}>
  //                 {option.name}
  //               </span>

  //           </>
  //         );
  //       }}
  //       onChange={(_, newValue) => {
  //         if (multiple) {
  //           onChange(
  //             newValue.map(location => get(location, 'id', '')),
  //           );
  //         } else {
  //           onChange(get(newValue, 'id', ''));
  //         }
  //       }}
  //       getOptionLabel={option => get(option, 'name', '')}
  //       getOptionSelected={option =>
  //         option.id ? option.id === get(currentRegion, 'id') : false
  //       }
  //       renderInput={params => (
  //         <div>
  //           <TextField
  //             {...params}
  //             style={{ width: 280 }}
  //             variant="standard"
  //             label={editLabel}
  //           />
  //         </div>
  //       )}
  //       multiple={multiple}
  //       {...rest}
  //     />
  //     {showDescription ? (
  //       <FormHelperText>{description}</FormHelperText>
  //     ) : null}
  //   </FormCore>
  // );


  return (
    <FormCore schema={schema} width={width}>
      <Button
        style={{
          width:"100%",

          borderBottom: '1px solid #ccc',
        }}
        onClick={() => {setModalOpen(!modalOpen)}} 
        >
        <FormattedMessage id="SEARCH_REGION" />
      </Button>
      {modalOpen && <TreeViewDemo onChange={onChange}/>}
    </FormCore>)

}
